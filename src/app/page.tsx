import type { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";
import prisma from "@/lib/prisma";

export async function createUser(formData: FormData) {
  "use server";

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const emailValue = formData.get("email");
  const nameValue = formData.get("name");

  const email =
    typeof emailValue === "string" ? emailValue.trim().toLowerCase() : "";
  const name =
    typeof nameValue === "string" && nameValue.trim().length > 0
      ? nameValue.trim()
      : null;

  if (!email) {
    redirect(`/?error=${encodeURIComponent("Email is required")}`);
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
      `/?error=${encodeURIComponent(
        "Could not create user. Please try again."
      )}`
    );
  }

  revalidatePath("/");
  redirect(`/?success=${encodeURIComponent("User added successfully.")}`);
}

export async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const successMessage =
    typeof resolvedSearchParams?.success === "string"
      ? resolvedSearchParams.success
      : undefined;
  const errorMessage =
    typeof resolvedSearchParams?.error === "string"
      ? resolvedSearchParams.error
      : undefined;

  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
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
        {errorMessage ? (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {successMessage ? (
          <p className="mt-2 text-sm text-green-700" role="status">
            {successMessage}
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
    </div>
  );
}

export default HomePage;
