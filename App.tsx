import React, { useState, useCallback } from 'react';
import FormField from './components/FormField';
import GeneratedPlan from './components/GeneratedPlan';
import LoadingSpinner from './components/LoadingSpinner';
import { generateLessonPlan } from './services/geminiService';

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    identifikasiUmum: 'Biologi, Kelas XI, Semester 2',
    jumlahJam: '4 JP',
    tujuan: 'Siswa mampu memahami konsep daur air dan pentingnya menjaga keseimbangan ekosistem.',
    dimensiLulusan: 'Penalaran kritis, kolaborasi, kepedulian lingkungan',
    topik: 'Daur Air',
    metode: 'Project-Based Learning',
    pemanfaatanDigital: 'Canva, Powerpoint, Quizizz',
  });
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGeneratePlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPlan(null);

    const { identifikasiUmum, jumlahJam, tujuan, dimensiLulusan, topik, metode, pemanfaatanDigital } = formData;
    if (!identifikasiUmum || !jumlahJam || !tujuan || !dimensiLulusan || !topik || !metode || !pemanfaatanDigital) {
      setError('Harap isi semua kolom untuk membuat rencana pembelajaran.');
      setIsLoading(false);
      return;
    }

    try {
      const plan = await generateLessonPlan(identifikasiUmum, jumlahJam, tujuan, dimensiLulusan, topik, metode, pemanfaatanDigital);
      setGeneratedPlan(plan);
    } catch (err) {
      setError('Terjadi kesalahan saat membuat rencana. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return (
    <div className="min-h-screen bg-slate-100/50 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Generator Rencana Pembelajaran AI
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Buat Rencana Pelaksanaan Pembelajaran (RPP) yang terstruktur dan inovatif secara otomatis dengan Gemini.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Data Pembelajaran</h2>
            <div className="space-y-5">
              <FormField
                id="identifikasiUmum"
                label="Identifikasi Umum"
                value={formData.identifikasiUmum}
                onChange={handleInputChange}
                placeholder="Contoh: Biologi, Kelas XI, Semester 2"
              />
              <FormField
                id="jumlahJam"
                label="Jumlah Jam Pelajaran"
                value={formData.jumlahJam}
                onChange={handleInputChange}
                placeholder="Contoh: 4 JP"
              />
              <FormField
                id="tujuan"
                label="Tujuan Pembelajaran"
                type="textarea"
                rows={3}
                value={formData.tujuan}
                onChange={handleInputChange}
                placeholder="Jelaskan apa yang harus dicapai siswa..."
              />
              <FormField
                id="dimensiLulusan"
                label="Dimensi Profil Lulusan"
                value={formData.dimensiLulusan}
                onChange={handleInputChange}
                placeholder="Contoh: Bernalar Kritis, Kreatif, Gotong Royong"
              />
              <FormField
                id="topik"
                label="Topik Pembelajaran"
                value={formData.topik}
                onChange={handleInputChange}
                placeholder="Contoh: Daur Air"
              />
              <FormField
                id="metode"
                label="Metode Pembelajaran"
                value={formData.metode}
                onChange={handleInputChange}
                placeholder="Contoh: Project-Based Learning, Discovery Learning"
              />
               <FormField
                id="pemanfaatanDigital"
                label="Pemanfaatan Digital"
                value={formData.pemanfaatanDigital}
                onChange={handleInputChange}
                placeholder="Contoh: Canva, Powerpoint, Quizizz, Mentimeter"
              />
              <button
                onClick={handleGeneratePlan}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center space-x-2"
              >
                {isLoading && <LoadingSpinner />}
                <span>{isLoading ? 'Membuat Rencana...' : 'Buat Rencana Pembelajaran'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 flex flex-col">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Hasil Rencana Pembelajaran</h2>
            <div className="flex-grow bg-slate-50 rounded-lg p-6 min-h-[400px] max-h-[70vh] overflow-y-auto border border-slate-200">
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <LoadingSpinner />
                  <p className="mt-4 text-lg font-medium">AI sedang meracik rencana terbaik...</p>
                </div>
              )}
              {error && (
                <div className="flex items-center justify-center h-full text-red-600 bg-red-50 p-4 rounded-lg">
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && !generatedPlan && (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <p className="text-center">Hasil rencana pembelajaran Anda akan muncul di sini.</p>
                </div>
              )}
              {generatedPlan && <GeneratedPlan planText={generatedPlan} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;