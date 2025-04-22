import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltRounds?: number) => {
    return await bcrypt.hash(value, saltRounds || 10);
}

export const compareValue = async (value: string, hashValue: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(value, hashValue);
    } catch {
        return false;
    }
};
