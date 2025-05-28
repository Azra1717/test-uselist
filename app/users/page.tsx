'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import UserList from '../components/UserList';
import { getUsers, deleteUser as deleteUserService } from '../services/userService';
import { toast } from 'react-toastify';

type User = {
  id: number;
  firstname: string;
  lastname: string;
  birthdate: string;
  address: {
    street: string;
    city: string;
    province: string;
    postal_code: string;
  };
};

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  const fetchUsers = async () => {
    setIsLoading(true); 
    const data = await getUsers();
    setUsers(data);
    setIsLoading(false); 
  };

  const deleteUser = async (id: number) => {
    try{await deleteUserService(id);
    toast.success('Data berhasil dihapus!');
    fetchUsers();
    }catch{
      toast.error('Data Gagal dihapus!');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const filteredUsers = users.filter(user =>
    user.users.firstname.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link href="/users/new" className="btn btn-success">+ Tambah User</Link>
        <input
          type="text"
          className="form-control w-50"
          placeholder="Cari berdasarkan nama depan"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
      <UserList users={currentUsers} onDelete={deleteUser} />

      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <li key={idx} className={`page-item ${currentPage === idx + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(idx + 1)}>
                {idx + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      </>
      )}
    </div>
  );
}
