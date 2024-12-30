import React, { useContext, useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { useParams } from "react-router";
import { toast } from "sonner";
import apiService from "@/service/apiService";
import { HexColorPicker } from "react-colorful";

function ThemeColor() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [color, setColor] = useState("#000000");
  const { resumeId } = useParams();

  useEffect(() => {
    if (resumeInfo?.themeColor) {
      setColor(resumeInfo.themeColor);
    }
  }, [resumeInfo?.themeColor]);

  const onColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const onColorSelect = () => {
    setResumeInfo({
      ...resumeInfo,
      themeColor: color,
    });
    const data = {
      data: {
        themeColor: color,
      },
    };
    apiService.updateResumeDetail(resumeId, data).then((resp) => {
      console.log(resp);
      toast("Theme Color Updated");
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <Palette className="w-4 h-4" />
          Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4">
          <h2 className="mb-2 text-sm font-semibold">Select Theme Color</h2>
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-8 h-8 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <HexColorPicker color={color} onChange={onColorChange} />
            <Button onClick={onColorSelect} className="w-full">
              Apply Color
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
