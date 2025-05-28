'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

type UserFormData = {
  firstname: string;
  lastname: string;
  birthdate: string;
  street: string;
  city: string;
  province: string;
  postal_code: string;
};

type FieldErrors = {
  [key: string]: string[] | undefined;
};

type Props = {
  initialData?: UserFormData;
  onSubmit: (data: any) => Promise<void>;
};

const mapAddressErrors = (addressErrors: string[] | undefined): FieldErrors => {
  if (!addressErrors) return {};
  return {
    street: addressErrors[0] ? [addressErrors[0]] : undefined,
    city: addressErrors[1] ? [addressErrors[1]] : undefined,
    province: addressErrors[2] ? [addressErrors[2]] : undefined,
    postal_code: addressErrors[3] ? [addressErrors[3]] : undefined,
  };
};

export default function UserForm({ initialData, onSubmit }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<UserFormData>(() => {
    if (initialData) {
      return {
        ...initialData,
        birthdate: initialData.birthdate.split('T')[0],
      };
    }
    return {
      firstname: '',
      lastname: '',
      birthdate: '',
      street: '',
      city: '',
      province: '',
      postal_code: '',
    };
  });

  const [errors, setErrors] = useState<FieldErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      firstname: form.firstname,
      lastname: form.lastname,
      birthdate: form.birthdate,
      address: {
        street: form.street,
        city: form.city,
        province: form.province,
        postalCode: form.postal_code,
      },
    };

    try {
      await onSubmit(payload);
      toast.success('Data berhasil disimpan!');
      router.push('/users');
    } catch (err: any) {
      if (err?.errors) {
        const { address, ...rest } = err.errors;
        setErrors({
          ...rest,
          ...mapAddressErrors(address),
        });
      } else {
        toast.error(err.message || 'Terjadi kesalahan saat mengirim data.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4" style={{ maxWidth: 600 }}>
      <h4 className="mb-4">Formulir Pengguna</h4>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
              placeholder="First Name"
            />
            <label htmlFor="firstname">First Name</label>
            {errors.firstname && (
              <div className="invalid-feedback">{errors.firstname[0]}</div>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
              placeholder="Last Name"
            />
            <label htmlFor="lastname">Last Name</label>
            {errors.lastname && (
              <div className="invalid-feedback">{errors.lastname[0]}</div>
            )}
          </div>
        </div>
      </div>
      <div className="form-floating mb-4">
        <input
          type="date"
          id="birthdate"
          name="birthdate"
          value={form.birthdate}
          onChange={handleChange}
          className={`form-control ${errors.birthdate ? 'is-invalid' : ''}`}
          placeholder="Birthdate"
        />
        <label htmlFor="birthdate">Birthdate</label>
        {errors.birthdate && (
          <div className="invalid-feedback">{errors.birthdate[0]}</div>
        )}
      </div>

      <hr />

      <h5 className="mb-3">Alamat</h5>
      <div className="form-floating mb-3">
        <input
          type="text"
          id="street"
          name="street"
          value={form.street}
          onChange={handleChange}
          className={`form-control ${errors.street ? 'is-invalid' : ''}`}
          placeholder="Street"
        />
        <label htmlFor="street">Street</label>
        {errors.street && <div className="invalid-feedback">{errors.street[0]}</div>}
      </div>

      <div className="row g-3 mb-4">
      
        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              className={`form-control ${errors.city ? 'is-invalid' : ''}`}
              placeholder="City"
            />
            <label htmlFor="city">City</label>
            {errors.city && <div className="invalid-feedback">{errors.city[0]}</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input
              type="text"
              id="province"
              name="province"
              value={form.province}
              onChange={handleChange}
              className={`form-control ${errors.province ? 'is-invalid' : ''}`}
              placeholder="Province"
            />
            <label htmlFor="province">Province</label>
            {errors.province && (
              <div className="invalid-feedback">{errors.province[0]}</div>
            )}
          </div>
        </div>
      </div>

      <div className="form-floating mb-4">
        <input
          type="text"
          id="postal_code"
          name="postal_code"
          value={form.postal_code}
          onChange={handleChange}
          className={`form-control ${errors.postal_code ? 'is-invalid' : ''}`}
          placeholder="Postal Code"
        />
        <label htmlFor="postal_code">Postal Code</label>
        {errors.postal_code && (
          <div className="invalid-feedback">{errors.postal_code[0]}</div>
        )}
      </div>

      <div className="d-flex gap-3 mb-5">
        <button
          type="button"
          className="btn btn-outline-secondary flex-grow-1"
          onClick={() => router.back()}
        >
          Kembali
        </button>
        <button type="submit" className="btn btn-primary flex-grow-1">
          Submit
        </button>
      </div>
    </form>
  );
}
