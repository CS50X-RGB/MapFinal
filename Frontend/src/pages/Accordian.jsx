import React, { useState } from "react";

const AccordionItem = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-black rounded-2xl border border-white">
      <div onClick={toggleAccordion}>{title}</div>
      {isOpen && <div className="bg-blue-700 font-mono">{content}</div>}
    </div>
  );
};

const Accordion = ({ items }) => {
  return (
    <div className="rounded-xl">
      {items.map((item, index) => (
        <AccordionItem key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
};

const Example = () => {
  const accordionItems = [
    { title: "Section 1", content: "Content for Section 1" },
    { title: "Section 2", content: "Content for Section 2" },
  ];

  return (
    <div>
      <Accordion items={accordionItems} />
    </div>
  );
};

export default Example;
