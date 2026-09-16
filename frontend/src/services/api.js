// const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
import { useState } from 'react';
// async function handleResponse(response) {
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({}));
//     throw new Error(error.message || 'Une erreur est survenue');
//   }
//   return response.json();
// }

// export async function getCalculations() {
//   const response = await fetch(`${API_BASE_URL}/calculations`);
//   return handleResponse(response);
// }

// export async function getCalculation(id) {
//   const response = await fetch(`${API_BASE_URL}/calculations/${id}`);
//   return handleResponse(response);
// }

// export async function saveCalculation(data) {
//   const response = await fetch(`${API_BASE_URL}/calculations`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//   return handleResponse(response);
// }

// export async function deleteCalculation(id) {
//   const response = await fetch(`${API_BASE_URL}/calculations/${id}`, {
//     method: 'DELETE',
//     headers: {
//       Accept: 'application/json',
//     },
//   });
//   return handleResponse(response);
// }
function App() {
  const [data] = useState([
    { id: 1, name: 'Emballage Carton', value: 150 },
    { id: 2, name: 'Emballage Plastique', value: 200 }
  ]);

  return (
    <div>
      <h1>الاتصال مع البيانات المحفوظة</h1>
      {data.map(item => (
        <p key={item.id}>{item.name} - {item.value}</p>
      ))}
    </div>
  );
}


