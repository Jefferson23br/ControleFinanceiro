import React from 'react';
import LancamentoForm from '@/components/LancamentoForm';

export default function Despesa() {
  const handleSave = () => {
    console.log('Lançamento de despesa salvo');
  };

  return <LancamentoForm tipo="despesa" onSave={handleSave} />;
}