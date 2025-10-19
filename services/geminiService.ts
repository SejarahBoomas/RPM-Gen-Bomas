import { GoogleGenAI } from "@google/genai";

// Initialize the Google Gemini AI client.
// It is assumed that the API key is available in the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Generates a lesson plan by calling the Gemini API.
 * It constructs a detailed prompt based on user inputs and asks the model
 * to generate a structured lesson plan, including a markdown table for assessments
 * with analytical and correlative summative questions.
 */
export async function generateLessonPlan(
  identifikasi_umum: string,
  jumlah_jam: string,
  tujuan: string,
  dimensi_lulusan: string,
  topik: string,
  metode: string,
  pemanfaatan_digital: string
): Promise<string> {
  const prompt = `
Anda adalah asisten AI yang ahli dalam membuat Rencana Pelaksanaan Pembelajaran (RPP) untuk guru di Indonesia. Buatkan RPP yang terstruktur dan inovatif berdasarkan data berikut:

- **Identifikasi Umum:** ${identifikasi_umum}
- **Alokasi Waktu:** ${jumlah_jam}
- **Tujuan Pembelajaran:** ${tujuan}
- **Dimensi Profil Lulusan:** ${dimensi_lulusan}
- **Topik Pembelajaran:** ${topik}
- **Metode Pembelajaran:** ${metode}
- **Pemanfaatan Digital:** ${pemanfaatan_digital}

Struktur RPP harus mencakup bagian-bagian berikut, menggunakan format Markdown:

### Identitas Pembelajaran
Tampilkan detail identifikasi umum dan alokasi waktu.

### Rencana Pembelajaran
Terdiri dari 3 bagian:
#### Kegiatan Awal (Estimasi waktu: 15%)
Jelaskan kegiatan pembuka, apersepsi, dan motivasi.

#### Kegiatan Inti (Estimasi waktu: 70%)
Jelaskan pengalaman belajar (memahami, mengaplikasi, merefleksi) dengan menerapkan metode yang diberikan dan fokus pada dimensi lulusan. Sebutkan topik dan pemanfaatan digital yang relevan. Gunakan list (- item) untuk poin-poin penting.

#### Kegiatan Penutup (Estimasi waktu: 15%)
Jelaskan kegiatan rangkuman, asesmen formatif, dan umpan balik.

### Asesmen Pembelajaran
- **Sajikan bagian ini dalam bentuk tabel markdown.**
- Tabel harus memiliki kolom: "Jenis Asesmen", "Bentuk Instrumen", dan "Contoh/Keterangan".
- Isi tabel dengan asesmen **Diagnostik**, **Formatif**, dan **Sumatif**.
- **Untuk Asesmen Sumatif**, pada kolom "Contoh/Keterangan", berikan 2-3 contoh soal esai yang bersifat **analitis dan korelatif** sesuai dengan topik dan tujuan pembelajaran yang diberikan.

Terakhir, sertakan kalimat penutup:
*Rencana pembelajaran ini disusun untuk menciptakan pengalaman belajar yang berkesadaran, bermakna, dan menggembirakan.*

Gunakan format markdown untuk heading (### dan ####), bold (**teks**), dan list (- item).
`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Gagal menghasilkan rencana pembelajaran dari AI. Silakan coba lagi.");
  }
}
