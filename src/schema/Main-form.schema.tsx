import { z } from "zod";

const MainFormSchema = z.object({
  name: z.string().min(1, "Name is required"), // Name must be a non-empty string
  email: z.string().email("Invalid email address"), // Email must be a valid email address
  questions: z.string().min(1, "At least one question is required") // Questions must be an array of strings with at least one element
});

export default MainFormSchema;