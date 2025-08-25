import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        return (
            <Input
                suffix={
                    showPassword ? (
                        <EyeIcon onClick={() => setShowPassword(false)} />
                    ) : (
                        <EyeOffIcon onClick={() => setShowPassword(true)} />
                    )
                }
                className={className}
                {...props}
                ref={ref}
                type={showPassword ? "text" : "password"}
            />
        );
    }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
