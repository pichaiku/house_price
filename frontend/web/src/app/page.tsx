'use client';

import { useState, type ReactNode } from 'react';
import axios from 'axios';

type FieldProps = {
  id: string;
  label: string;
  hint: string;
  value: number | null;
  onChange: (value: number | null) => void;
  icon: ReactNode;
};

function Icon({ children }: { children: ReactNode }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">{children}</svg>;
}

function InputField({ id, label, hint, value, onChange, icon }: FieldProps) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">{label}</span>
      <span className="input-wrap">
        <span className="input-icon">{icon}</span>
        <input id={id} type="number" min="0" value={value ?? ''} placeholder={hint}
          onChange={(event) => onChange(event.target.value === '' ? null : Number(event.target.value))} />
      </span>
    </label>
  );
}

export default function Home() {
  const [age, setAge] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [minimart, setMinimart] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePrice = async () => {
    if (age === null || distance === null || minimart === null) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }
    setLoading(true); setError(null); setPrice(null); setCurrency(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/house', { age, distance, minimart });
      setPrice(response.data.price); setCurrency(response.data.currency);
    } catch (requestError) {
      setError('ไม่สามารถเชื่อมต่อกับ API ได้ กรุณาตรวจสอบว่า Backend กำลังทำงานอยู่');
      console.error(requestError);
    } finally { setLoading(false); }
  };

  const formIsReady = age !== null && distance !== null && minimart !== null;
  const homeIcon = <Icon><path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></Icon>;

  return (
    <main className="app-shell">
      <div className="background-orb orb-one" /><div className="background-orb orb-two" />
      <section className="dashboard" aria-label="House Lens house price estimator">
        <header className="topbar">
          <div className="brand"><div className="brand-mark">{homeIcon}</div><div><strong>House Lens</strong><span>Smart home valuation</span></div></div>
          <div className="status-pill"><span className="status-dot" /> AI estimate</div>
        </header>

        <div className="hero-copy"><h1 className="flex items-center gap-2 whitespace-nowrap"><span>ประเมินราคาบ้าน ได้ง่ายในไม่กี่ขั้นตอน</span></h1><p className="subtitle">กรอกข้อมูลบ้านของคุณ แล้วให้ House Lens ช่วยคำนวณราคาโดยประมาณ</p></div>

        <div className="content-grid">
          <section className="form-card">
            <div className="card-heading"><div><h2>ข้อมูลบ้าน</h2><p>ข้อมูลยิ่งครบ ผลลัพธ์ยิ่งแม่นยำ</p></div><span className="step-badge">01 / 01</span></div>
            <div className="form-fields">
              <InputField id="age" label="อายุบ้าน (ปี)" hint="0 - 120" value={age} onChange={setAge} icon={<Icon><rect x="3" y="4" width="18" height="17" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M7 2v4M17 2v4M3 9h18" stroke="currentColor" strokeWidth="1.8" /></Icon>} />
              <InputField id="distance" label="ระยะทางถึง MRT (เมตร)" hint="0 - 10,000" value={distance} onChange={setDistance} icon={<Icon><path d="M12 21s7-6.2 7-12A7 7 0 0 0 5 9c0 5.8 7 12 7 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="9" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.8" /></Icon>} />
              <InputField id="minimart" label="ร้านสะดวกซื้อใกล้เคียง (แห่ง)" hint="0 - 20" value={minimart} onChange={setMinimart} icon={<Icon><path d="M4 10h16v10H4zM3 10l2-5h14l2 5M8 14h3v6H8zM16 14h2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></Icon>} />
            </div>
            <button className="primary-button" onClick={calculatePrice} disabled={loading || !formIsReady}>{loading ? <><span className="spinner" />กำลังประเมินราคา...</> : <>ประเมินราคาบ้าน <span className="button-arrow">→</span></>}</button>
            {error && <div className="error-message" role="alert">{error}</div>}
          </section>

          <aside className={`result-card ${price === null ? 'empty' : ''}`}><div className="result-glow" /><span className="result-icon">{homeIcon}</span><p className="result-label">ESTIMATED VALUE</p>
            {price !== null ? <><p className="price">{Math.round(price).toLocaleString()} <small>{currency || 'บาท'}</small></p><p className="result-note">ราคาประเมินโดยอ้างอิงจากข้อมูลที่คุณกรอก</p></> : <><h2>ผลลัพธ์จะแสดงที่นี่</h2><p className="result-note">กรอกข้อมูลให้ครบ แล้วกดปุ่มประเมินราคาเพื่อดูผลลัพธ์</p></>}
            <div className="result-footer"><span className="sparkle">✦</span> Powered by House Lens AI</div>
          </aside>
        </div>
        <footer className="page-footer">ผลลัพธ์เป็นการประมาณการเบื้องต้น และอาจแตกต่างจากราคาตลาดจริง</footer>
      </section>
    </main>
  );
}
