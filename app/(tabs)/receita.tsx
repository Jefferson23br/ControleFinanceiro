import React from 'react';
import LancamentoForm from '@/components/LancamentoForm';

export default function Receita() {
  const handleSave = () => {
    console.log('Lançamento de receita salvo');
  };

  return <LancamentoForm tipo="receita" onSave={handleSave} />;
}