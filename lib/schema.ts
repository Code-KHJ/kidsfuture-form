import { z } from "zod";

export const applicationSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요").max(40),
  team: z.string().trim().min(1, "부서/팀을 입력해 주세요").max(60),
  session1: z.enum(["5/26", "5/29"], { message: "1회차 일정을 선택해 주세요" }),
  session2: z.enum(["6/4", "6/8"], { message: "2회차 일정을 선택해 주세요" }),
  ai_level: z.number().int().min(1).max(5),
  expectation: z.string().trim().min(1, "기대하는 점을 입력해 주세요").max(800),
  extra: z.string().trim().max(800).optional().or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
