'use client';

import Link from 'next/link';

type User = {
 users: {
    id: number;
    firstname: string;
    lastname: string;
    birthdate: string;
  };
  addresses: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  } | null;
};

type Props = {
  users: User[];
  onDelete: (id: number) => void;
};

export default function UserList({ users, onDelete }: Props) {
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Daftar User</h2>
      {users.length === 0 ? (
        <p>Data tidak ada.</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nama</th>
              <th>Tanggal Lahir</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.users.id}>
                <td>{u.users.firstname} {u.users.lastname}</td>
                <td>{new Date(u.users.birthdate).toLocaleDateString()}</td>
                <td>
                  {u.addresses
                    ? `${u.addresses.street}, ${u.addresses.city}, ${u.addresses.province} ${u.addresses.postalCode}`
                    : "-"}
                </td>
                <td>
                  <Link href={`/users/${u.users.id}/edit`} className="btn btn-sm btn-primary me-2">
                    Edit
                  </Link>
                  <button onClick={() => onDelete(u.users.id)} className="btn btn-sm btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  
}
