import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
    { code: "english", label: "English" },
    { code: "spanish", label: "Spanish" },
    { code: "french", label: "French" },
    { code: "german", label: "German" },
    { code: "hindi", label: "Hindi" },
    { code: "japanese", label: "Japanese" },
    { code: "korean", label: "Korean" },
    { code: "chinese", label: "Chinese" },
];

type Props = {
    value: string,
    onValueChange: (value: string) => void,
    isDisabled?: boolean,
}

export default function TargetLanguageSelector({ value, onValueChange, isDisabled }: Props) {

    return (

        <Select value={value} onValueChange={onValueChange} disabled={isDisabled}>
            <SelectTrigger>
                <SelectValue placeholder="Choose a language" />
            </SelectTrigger>
            <SelectContent>
                {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                        {lang.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
