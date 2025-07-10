// pages/index.js
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [form, setForm] = useState({ mood: '', intention: '' });
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok && data.text) {
        setResult(data.text);
      } else {
        setError(`Napaka: ${data?.e
