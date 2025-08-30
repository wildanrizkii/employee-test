import z from "zod";

export const testSchema = {
    schedule: z.object({
        PelaksanaanTes: z.string(),
        JenisTes: z.array(z.string()), // array of string
        IdDataPelamar: z.string(),
        NIK: z.string(),
        PhoneNumber: z.string(),
        NamaLengkap: z.string(),
        TempatLahir: z.string(),
        Email: z.string().email(),
        Cabang: z.string(),
        tempat_tes: z.string().optional(),
        emailCabang: z.string().optional(),
        Penempatan: z.string(),
    })
}