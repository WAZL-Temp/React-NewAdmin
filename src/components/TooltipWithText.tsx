import { Button } from "../sharedBase/globalImports";

interface TooltipWithTextProps {
  text: string;
}

const TooltipWithText = ({ text }:TooltipWithTextProps) => {
  return (
    <div className="inline-block tooltip-container">
      <Button
        type="button"
        icon="pi pi-info-circle"
        className="p-button-text p-button-rounded p-button-info text-sm text-[var(--color-info)]"
        tooltip={text}
        tooltipOptions={{
          position: 'right',
          className: 'tooltip-text font-normal rounded text-xs lg:text-sm p-0 hide-tooltip-mobile'
        }}
      />
    </div>
  );
};

export default TooltipWithText;

