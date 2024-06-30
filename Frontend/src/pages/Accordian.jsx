import { Accordion, AccordionItem } from "@nextui-org/react"
export default function Accordian() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  return (
    <>
      <Accordion className="text-white w-1/2">
        <AccordionItem
          key="theme"
          aria-label="Theme"
          title="Theme"
          className="text-white"
        >
          {defaultContent}
        </AccordionItem>
      </Accordion>
    </>
  )
}
