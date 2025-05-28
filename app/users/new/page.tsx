'use client';

import { createUser } from '@/app/services/userService';
import UserForm from '../../components/UserForm';

export default function AddUserPage() {
  const handleSubmit = async (form: any) => {
    await createUser(form); 
  };

  
  return (
    <div>
      <h2>Add User</h2>
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
}
