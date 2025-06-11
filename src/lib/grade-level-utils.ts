import { DatabaseService } from "./db-service";

export interface GradeLevelWithBasic {
  id: number;
  name: string;
  alias: string;
  is_basic: boolean;
}

let cachedGradeLevels: GradeLevelWithBasic[] | null = null;

export async function getGradeLevels(): Promise<GradeLevelWithBasic[]> {
  if (cachedGradeLevels) {
    return cachedGradeLevels;
  }

  const dbService = DatabaseService.getInstance();
  const gradeLevels = await dbService.getGradeLevels();
  cachedGradeLevels = gradeLevels;
  return gradeLevels;
}

export function processGradeLevelForStudent(
  gradeLevelName: string,
  gradeLevels: GradeLevelWithBasic[]
): string {
  // Find the grade level in our data
  const gradeLevel = gradeLevels.find((gl) => gl.name === gradeLevelName);

  if (gradeLevel && gradeLevel.is_basic) {
    return gradeLevel.alias;
  }

  // For advanced classes, return the full name
  return gradeLevelName;
}

export function processGradeLevelsForInstructor(
  gradeLevelIdentifiers: string[],
  gradeLevels: GradeLevelWithBasic[]
): string[] {
  const result: string[] = [];

  // Create maps for quick lookup by both name and alias
  const gradeLevelByName = new Map(gradeLevels.map((gl) => [gl.name, gl]));
  const gradeLevelByAlias = new Map(gradeLevels.map((gl) => [gl.alias, gl]));

  // Helper function to find grade level by name or alias
  const findGradeLevel = (identifier: string) => {
    return (
      gradeLevelByName.get(identifier) || gradeLevelByAlias.get(identifier)
    );
  };

  // Define K-8 levels (elementary + middle school)
  const k8Levels = gradeLevels
    .filter(
      (gl) =>
        gl.is_basic &&
        ["K", "1", "2", "3", "4", "5", "6", "7", "8"].includes(gl.name)
    )
    .sort((a, b) => a.id - b.id);

  // Define high school basic levels (Algebra 1 through Pre-Calculus)
  const highSchoolBasicLevels = gradeLevels
    .filter(
      (gl) =>
        gl.is_basic &&
        ["Algebra 1", "Geometry", "Algebra 2", "Pre-Calculus"].includes(gl.name)
    )
    .sort((a, b) => a.id - b.id);

  // Get advanced classes (non-basic levels) that the instructor teaches
  const advancedClasses = gradeLevelIdentifiers
    .filter((identifier) => {
      const gl = findGradeLevel(identifier);
      return gl && !gl.is_basic;
    })
    .map((identifier) => {
      const gl = findGradeLevel(identifier);
      return gl ? gl.alias : identifier; // Use alias for advanced classes
    })
    .sort(); // Sort alphabetically for consistency

  // Add advanced classes FIRST
  result.push(...advancedClasses);

  // Check K-8 range
  const teachesK8 = k8Levels.map((level) =>
    gradeLevelIdentifiers.some((identifier) => {
      const gl = findGradeLevel(identifier);
      return gl && gl.id === level.id;
    })
  );

  // Find the highest consecutive K-8 level starting from K
  let highestK8Consecutive = -1;
  for (let i = 0; i < k8Levels.length; i++) {
    if (teachesK8[i]) {
      highestK8Consecutive = i;
    } else {
      break;
    }
  }

  // Create K-8 range display if teaching from K
  if (highestK8Consecutive >= 0 && teachesK8[0]) {
    const range =
      highestK8Consecutive === 0
        ? k8Levels[0].alias
        : `${k8Levels[0].alias}-${k8Levels[highestK8Consecutive].alias}`;
    result.push(range);
  }

  // Add any non-consecutive K-8 levels
  for (let i = highestK8Consecutive + 1; i < k8Levels.length; i++) {
    if (teachesK8[i]) {
      result.push(k8Levels[i].alias);
    }
  }

  // Add high school basic levels individually
  const highSchoolLevelsTeaches = highSchoolBasicLevels.filter((level) =>
    gradeLevelIdentifiers.some((identifier) => {
      const gl = findGradeLevel(identifier);
      return gl && gl.id === level.id;
    })
  );

  // Add high school basic levels to result
  result.push(...highSchoolLevelsTeaches.map((level) => level.alias));

  return result;
}
