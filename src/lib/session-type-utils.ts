import { DatabaseService } from "./db-service";

export interface SessionType {
  id: number;
  code: string;
  length: number;
  sessionAlias: string;
}

let cachedSessionTypes: SessionType[] | null = null;

export async function getSessionTypes(): Promise<SessionType[]> {
  if (cachedSessionTypes) {
    return cachedSessionTypes;
  }

  const dbService = DatabaseService.getInstance();
  const sessionTypes = await dbService.getSessionTypes();
  cachedSessionTypes = sessionTypes;
  return sessionTypes;
}

export function clearSessionTypesCache(): void {
  cachedSessionTypes = null;
}

export async function addSessionType(data: {
  code: string;
  length: number;
  sessionAlias: string;
}): Promise<number> {
  const dbService = DatabaseService.getInstance();
  const id = await dbService.addSessionType(data);
  clearSessionTypesCache();
  return id;
}

export async function updateSessionType(
  id: number,
  data: Partial<{ code: string; length: number; sessionAlias: string }>
): Promise<boolean> {
  const dbService = DatabaseService.getInstance();
  const success = await dbService.updateSessionType(id, data);
  if (success) {
    clearSessionTypesCache();
  }
  return success;
}

export async function deleteSessionType(id: number): Promise<boolean> {
  const dbService = DatabaseService.getInstance();
  const success = await dbService.deleteSessionType(id);
  if (success) {
    clearSessionTypesCache();
  }
  return success;
}
