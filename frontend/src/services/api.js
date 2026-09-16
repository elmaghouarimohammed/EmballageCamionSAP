// src/services/api.js

const mockData = [
  { id: 1, name: 'Emballage Carton', value: 150 },
  { id: 2, name: 'Emballage Plastique', value: 200 }
];

export async function getCalculations() {
  return Promise.resolve(mockData);
}

export async function getCalculation(id) {
  const item = mockData.find(calc => calc.id === Number(id));
  return Promise.resolve(item);
}

export async function saveCalculation(data) {
  const newItem = { id: Date.now(), ...data };
  mockData.push(newItem);
  return Promise.resolve(newItem);
}

export async function deleteCalculation(id) {
  return Promise.resolve({ success: true });
}