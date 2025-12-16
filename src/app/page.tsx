import type { Project, User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import prisma from "@/lib/prisma";

async function requireSessionUser() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}

export async function createUser(formData: FormData) {
  "use server";

  await requireSessionUser();

  const emailValue = formData.get("email");
  const nameValue = formData.get("name");

  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const name =
    typeof nameValue === "string" && nameValue.trim().length > 0
      ? nameValue.trim()
      : null;

  if (!email) {
    redirect(`/?userError=${encodeURIComponent("Email is required")}`);
  }

  try {
    await prisma.user.create({
      data: {
        email,
        name,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    redirect(
      `/?userError=${encodeURIComponent(
        "Could not create user. Please try again."
      )}`
    );
  }

  revalidatePath("/");
  redirect(`/?userSuccess=${encodeURIComponent("User added successfully.")}`);
}

export async function createProject(formData: FormData) {
  "use server";

  await requireSessionUser();

  const titleValue = formData.get("title");
  const title = typeof titleValue === "string" ? titleValue.trim() : "";

  if (!title) {
    redirect(
      `/?projectError=${encodeURIComponent("Project title is required")}`
    );
  }

  try {
    await prisma.project.create({
      data: {
        title,
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    redirect(
      `/?projectError=${encodeURIComponent(
        "Could not create project. Please try again."
      )}`
    );
  }

  revalidatePath("/");
  redirect(
    `/?projectSuccess=${encodeURIComponent("Project created successfully.")}`
  );
}

export async function updateProject(formData: FormData) {
  "use server";

  await requireSessionUser();

  const idValue = formData.get("id");
  const titleValue = formData.get("title");

  const id = typeof idValue === "string" ? idValue : "";
  const title = typeof titleValue === "string" ? titleValue.trim() : "";

  if (!id || !title) {
    redirect(
      `/?projectError=${encodeURIComponent(
        "Project id and title are required"
      )}`
    );
  }

  try {
    await prisma.project.update({
      where: { id },
      data: { title },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    redirect(
      `/?projectError=${encodeURIComponent(
        "Could not update project. Please try again."
      )}`
    );
  }

  revalidatePath("/");
  redirect(
    `/?projectSuccess=${encodeURIComponent("Project updated successfully.")}`
  );
}

export async function deleteProject(formData: FormData) {
  "use server";

  await requireSessionUser();

  const idValue = formData.get("id");
  const id = typeof idValue === "string" ? idValue : "";

  if (!id) {
    redirect(
      `/?projectError=${encodeURIComponent("Project id is required to delete")}`
    );
  }

  try {
    await prisma.project.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    redirect(
      `/?projectError=${encodeURIComponent(
        "Could not delete project. Please try again."
      )}`
    );
  }

  revalidatePath("/");
  redirect(
    `/?projectSuccess=${encodeURIComponent("Project deleted successfully.")}`
  );
}

export async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const userSuccessMessage =
    typeof resolvedSearchParams?.userSuccess === "string"
      ? resolvedSearchParams.userSuccess
      : undefined;
  const userErrorMessage =
    typeof resolvedSearchParams?.userError === "string"
      ? resolvedSearchParams.userError
      : undefined;
  const projectSuccessMessage =
    typeof resolvedSearchParams?.projectSuccess === "string"
      ? resolvedSearchParams.projectSuccess
      : undefined;
  const projectErrorMessage =
    typeof resolvedSearchParams?.projectError === "string"
      ? resolvedSearchParams.projectError
      : undefined;

  await requireSessionUser();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen p-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <LogoutButton />
      </header>

      {users.length === 0 ? (
        <p className="text-gray-600">
          No users found. Add one with the form below.
        </p>
      ) : (
        <div className="space-y-4">
          {users.map((user: User) => (
            <div
              key={user.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <h2 className="font-semibold text-lg">
                {user.name || "No name"}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-400 mt-2">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900">Add a new user</h2>
        {userErrorMessage ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {userErrorMessage}
          </p>
        ) : null}
        {userSuccessMessage ? (
          <p className="mt-2 text-sm text-green-700" role="status">
            {userSuccessMessage}
          </p>
        ) : null}
        <form action={createUser} className="mt-4 space-y-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
              placeholder="user@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Name (optional)
            </label>
            <input
              type="text"
              name="name"
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
              placeholder="User name"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              Add user
            </button>
            <p className="text-xs text-gray-600">
              Submits directly from the dashboard.
            </p>
          </div>
        </form>
      </div>

      <div className="mt-10 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
        {projectErrorMessage ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {projectErrorMessage}
          </p>
        ) : null}
        {projectSuccessMessage ? (
          <p className="mt-2 text-sm text-green-700" role="status">
            {projectSuccessMessage}
          </p>
        ) : null}

        <form action={createProject} className="mt-4 space-y-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Project title
            </label>
            <input
              type="text"
              name="title"
              required
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
              placeholder="New project"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Create project
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {projects.length === 0 ? (
            <p className="text-gray-600">No projects yet. Create one above.</p>
          ) : (
            projects.map((project: Project) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="text-xs text-gray-500">
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                  <form
                    action={updateProject}
                    className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-3"
                  >
                    <input type="hidden" name="id" value={project.id} />
                    <label className="text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={project.title}
                      required
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none md:max-w-sm"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80"
                    >
                      Save
                    </button>
                  </form>
                  <form action={deleteProject} className="flex-none">
                    <input type="hidden" name="id" value={project.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
