"use client";

import { useRouter } from "next/navigation";
import UserForm from "../../components/UserForm";

export default function UserFormPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/users"); // Balik ke list user setelah tambah
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Form Tambah User</h1>
      <UserForm onSuccess={handleSuccess} onCancel={() => router.push("/users")} />
    </div>
  );
}
