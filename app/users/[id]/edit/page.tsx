'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import UserForm from '../../../components/UserForm';
import { getUserById, updateUser } from '../../../services/userService';

export default function EditUserPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      getUserById(id as string).then(data => setInitialData(data));
    }
  }, [id]);

  const handleSubmit = async (form: any) => {
    await updateUser(id as string, form);
  };

  if (!initialData)  
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div>
      <h2>Edit User</h2>
      <UserForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}
