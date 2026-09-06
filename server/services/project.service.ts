import * as repository from "~~/server/repositories/project.repository";
import { H3Event } from "h3";
import type {
  CreateProjectInput,
  ProjectPreviewImage,
  UpdateProjectInput,
} from "~~/server/model/project.model";
import { withTransaction } from "~~/server/db/postgres";
import { HttpError } from "~~/server/errors/HttpError";
import { get, set, del } from "~~/server/db/redis";
import { getMinioClient } from "~~/server/lib/minio";
import type { ParsedFile } from "~~/server/utils/common";

export async function invalidateProjectsCache() {
  try {
    await del("projects:all");
    await del("projects:status:true");
    await del("projects:status:false");
  } catch (e) {
    // ignore cache errors
  }
}

export const createProject = async (
  event: H3Event,
  body: CreateProjectInput,
) => {
  return withTransaction(async (client) => {
    const minioClient = getMinioClient();
    const namaFile = `portofolio/${Date.now()}-${crypto.randomUUID()}`;
    body.url = minioClient.getPublicUrl("project", namaFile);

    // Process preview images
    const previewFiles = (Array.isArray(body.preview_files)
      ? body.preview_files
      : body.preview_files
        ? [body.preview_files]
        : []) as ParsedFile[];

    const previewImages: ProjectPreviewImage[] = [];
    const metadataList = Array.isArray(body.preview_metadata)
      ? body.preview_metadata
      : [];

    for (let i = 0; i < metadataList.length; i++) {
      const meta = metadataList[i];
      if (!meta) continue;
      const fileIdx = meta.file_index !== undefined ? meta.file_index : i;
      const file = previewFiles[fileIdx];

      if (file) {
        const previewFileName = `portofolio/${Date.now()}-${crypto.randomUUID()}`;
        const previewUrl = minioClient.getPublicUrl("project", previewFileName);
        await minioClient.uploadFile(
          "project",
          previewFileName,
          file.data,
          file.contentType || "application/octet-stream",
        );
        previewImages.push({
          url: previewUrl,
          title: meta.title || "",
          caption: meta.caption || "",
        });
      } else if (meta.url) {
        previewImages.push({
          url: meta.url,
          title: meta.title || "",
          caption: meta.caption || "",
        });
      }
    }

    body.preview_images = previewImages;

    const projectId = await repository.createProject(client, body);
    if (!projectId) {
      throw new HttpError(
        500,
        "PROJECT_CREATION_FAILED",
        "Failed to create project",
      );
    }
    const ok = await repository.createProjectSkillRelation(
      client,
      projectId,
      body.id_skills,
    );
    if (!ok) {
      throw new HttpError(
        500,
        "PROJECT_SKILL_RELATION_CREATION_FAILED",
        "Failed to create project-skill relation",
      );
    }

    await invalidateProjectsCache();

    await minioClient.uploadFile(
      "project",
      namaFile,
      body.image.data,
      body.image.contentType || "application/octet-stream",
    );

    return sendSuccess(
      event,
      { project_id: projectId },
      "Project created successfully",
      "project_created",
      201,
    );
  });
};

export const getProjectsNoPagination = async (event: H3Event, status?: boolean) => {
  return withTransaction(async (client) => {
    const cacheKey = status !== undefined ? `projects:status:${status}` : "projects:all";
    const cachedProjects = await get(cacheKey);
    if (cachedProjects) {
      const projects = JSON.parse(cachedProjects);
      return sendSuccess(
        event,
        { data: projects },
        "Projects retrieved successfully",
        "projects_retrieved",
      );
    }

    const projects = await repository.getAllProjects(client, status);
    await set(cacheKey, JSON.stringify(projects)); // Cache the projects list

    return sendSuccess(
      event,
      { data: projects },
      "Projects retrieved successfully",
      "projects_retrieved",
    );
  });
};

export const getProjectsByCursor = async (
  event: H3Event,
  limit: number,
  cursor?: number,
  search?: string,
  status?: boolean,
) => {
  return withTransaction(async (client) => {
    const projects = await repository.getProjectCursorPagination(
      client,
      limit,
      search,
      cursor,
      status,
    );
    return sendSuccess(
      event,
      {
        data: projects,
        has_next: projects.length === limit,
      },
      "Projects retrieved successfully",
      "projects_retrieved",
    );
  });
};

export const updateProject = async (
  event: H3Event,
  data: UpdateProjectInput,
) => {
  return withTransaction(async (client) => {
    const minioClient = getMinioClient();

    const project = await repository.getProjectById(client, data.id);
    if (!project) {
      throw new HttpError(404, "PROJECT_NOT_FOUND", "Project not found");
    }

    const namaFile = `portofolio/${Date.now()}-${crypto.randomUUID()}`;
    if (data.image) {
      data.url = minioClient.getPublicUrl("project", namaFile);
    } else {
      data.url = project.preview_image;
    }

    // Process preview images
    const previewFiles = (Array.isArray(data.preview_files)
      ? data.preview_files
      : data.preview_files
        ? [data.preview_files]
        : []) as ParsedFile[];

    const updatedPreviewImages: ProjectPreviewImage[] = [];
    const metadataList = Array.isArray(data.preview_metadata)
      ? data.preview_metadata
      : [];

    for (let i = 0; i < metadataList.length; i++) {
      const meta = metadataList[i];
      if (!meta) continue;
      if (meta.url && (meta.file_index === undefined || meta.file_index === null)) {
        updatedPreviewImages.push({
          url: meta.url,
          title: meta.title || "",
          caption: meta.caption || "",
        });
      } else {
        const fileIdx = meta.file_index !== undefined ? meta.file_index : i;
        const file = previewFiles[fileIdx];
        if (file) {
          const previewFileName = `portofolio/${Date.now()}-${crypto.randomUUID()}`;
          const previewUrl = minioClient.getPublicUrl("project", previewFileName);
          await minioClient.uploadFile(
            "project",
            previewFileName,
            file.data,
            file.contentType || "application/octet-stream",
          );
          updatedPreviewImages.push({
            url: previewUrl,
            title: meta.title || "",
            caption: meta.caption || "",
          });
        } else if (meta.url) {
          updatedPreviewImages.push({
            url: meta.url,
            title: meta.title || "",
            caption: meta.caption || "",
          });
        }
      }
    }

    data.preview_images = updatedPreviewImages;

    const ok = await repository.updateProject(client, data);
    if (!ok) {
      throw new HttpError(
        500,
        "PROJECT_UPDATE_FAILED",
        "Failed to update project",
      );
    }

    const okRelation = await repository.deleteProjectSkillRelation(
      client,
      data.id,
    );
    if (!okRelation) {
      throw new HttpError(
        500,
        "PROJECT_SKILL_RELATION_DELETION_FAILED",
        "Failed to delete project-skill relation",
      );
    }

    const okNewRelation = await repository.createProjectSkillRelation(
      client,
      data.id,
      data.id_skills || [],
    );
    if (!okNewRelation) {
      throw new HttpError(
        500,
        "PROJECT_SKILL_RELATION_CREATION_FAILED",
        "Failed to create project-skill relation",
      );
    }

    await invalidateProjectsCache();

    if (data.image) {
      await minioClient.uploadFile(
        "project",
        namaFile,
        data.image.data,
        data.image.contentType || "application/octet-stream",
      );
      if (project.preview_image) {
        const oldCoverObj = extractObjectName(project.preview_image);
        if (oldCoverObj) {
          try {
            await minioClient.deleteFile("project", oldCoverObj);
          } catch (e) {
            console.error("Failed to delete old cover image:", e);
          }
        }
      }
    }

    // Clean up removed preview images from MinIO
    const oldPreviewImages: ProjectPreviewImage[] = Array.isArray(project.preview_images)
      ? project.preview_images
      : [];
    const newUrls = new Set(updatedPreviewImages.map((p) => p.url));

    for (const oldImg of oldPreviewImages) {
      if (oldImg.url && !newUrls.has(oldImg.url)) {
        const objectName = extractObjectName(oldImg.url);
        if (objectName) {
          try {
            await minioClient.deleteFile("project", objectName);
          } catch (err) {
            console.error("Failed to delete removed preview image:", err);
          }
        }
      }
    }

    return sendSuccess(
      event,
      null,
      "Project updated successfully",
      "project_updated",
    );
  });
};

export const deleteProject = async (event: H3Event, id: number) => {
  return withTransaction(async (client) => {
    const minioClient = getMinioClient();

    const project = await repository.getProjectById(client, id);
    if (!project) {
      throw new HttpError(404, "PROJECT_NOT_FOUND", "Project not found");
    }

    const ok = await repository.deleteProject(client, id);
    if (!ok) {
      throw new HttpError(
        500,
        "PROJECT_DELETION_FAILED",
        "Failed to delete project",
      );
    }

    await invalidateProjectsCache();

    if (project.preview_image) {
      const objectName = extractObjectName(project.preview_image);
      if (objectName) {
        try {
          await minioClient.deleteFile("project", objectName);
        } catch (err) {
          console.error("Failed to delete cover image on project delete:", err);
        }
      }
    }

    // Clean up all preview images
    const previewImages: ProjectPreviewImage[] = Array.isArray(project.preview_images)
      ? project.preview_images
      : [];
    for (const img of previewImages) {
      if (img.url) {
        const objectName = extractObjectName(img.url);
        if (objectName) {
          try {
            await minioClient.deleteFile("project", objectName);
          } catch (err) {
            console.error("Failed to delete preview image on project delete:", err);
          }
        }
      }
    }

    return sendSuccess(
      event,
      null,
      "Project deleted successfully",
      "project_deleted",
    );
  });
};

function extractObjectName(url: string): string | null {
  try {
    const parsed = new URL(url);

    // /project/portofolio/xxx.png
    const pathname = parsed.pathname;

    const prefix = "/project/";
    if (!pathname.startsWith(prefix)) return null;

    return pathname.replace(prefix, "");
  } catch {
    return null;
  }
}

export const getProjectById = async (event: H3Event, id: number) => {
  return withTransaction(async (client) => {
    const project = await repository.getProjectById(client, id);
    if (!project) {
      throw new HttpError(404, "PROJECT_NOT_FOUND", "Project not found");
    }

    return sendSuccess(
      event,
      project,
      "Project retrieved successfully",
      "project_retrieved",
    );
  });
};
