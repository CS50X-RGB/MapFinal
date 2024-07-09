import { Accordion, AccordionItem } from "@nextui-org/react"
import { EndIcon } from "./assets/EndIcon";



export default function Accordian({ title, description }) {
  return (
    <>
      <Accordion
        motionProps={{
          variants: {
            enter: {
              y: 10,
              opacity: 1,
              height: "auto",
              transition: {
                height: {
                  type: "spring",
                  stiffness: 500,
                  damping: 60,
                  duration: 10,
                },
                opacity: {
                  easings: "ease",
                  duration: 2,
                },
              },
            },
            exit: {
              y: -10,
              opacity: 0,
              height: 0,
              transition: {
                height: {
                  easings: "ease",
                  duration: 0.25,
                },
                opacity: {
                  easings: "ease",
                  duration: 0.3,
                },
              },
            },
          },
        }} itemClasses={{
          base: "bg-gradient-to-tl font-bold w-full md:w-1/2 from-[#02CFF2] via-[#00D1FF] to-[#000000] rounded-2xl p-4",
        }} variant="light">
        <AccordionItem indicator={<EndIcon />} key="1" aria-label="Accordion 1" classNames={{
          title: "text-black"
        }} title={title}>
          <div className="w-full h-1 bg-green-400 rounded-xl" />
          <h1 className="text-blue-800 font-bold">{description}</h1>
        </AccordionItem>
      </Accordion>
    </>
  )
}
