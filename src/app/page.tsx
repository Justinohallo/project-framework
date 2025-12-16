import prisma from "@/lib/prisma";

export default async function Home() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {users.length === 0 ? (
        <p className="text-gray-600">No users found. Create one via the API!</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
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
        <p className="text-sm text-gray-600">
          Create a new user via POST request to /api/users
        </p>
        <code className="text-xs bg-white p-2 rounded mt-2 block">
          {`curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"email": "test@example.com", "name": "Test User"}'`}
        </code>
      </div>
    </div>
  );
}
