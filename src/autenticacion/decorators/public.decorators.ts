import { SetMetadata } from "@nestjs/common";
import { PUBLIC_KEY } from "../constants/public.constants";

export const Public=()=>SetMetadata(PUBLIC_KEY, true)