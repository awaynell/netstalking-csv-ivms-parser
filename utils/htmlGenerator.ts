export const htmlGenerator = (htmlContent) => {
  return [
    {
      type: "head",
      content: [
        { type: "title", content: "Generated HTML" },
        {
          type: "style",
          content: `
          #wrapper {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
          }
          #item {
            border: 1px solid lightgray;
            height: 50px;
            width: 100%;
          }
          #item > span {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `,
        },
      ],
    },
    {
      type: "body",
      attributes: { style: "background-color: black; color: yellow;" },
      content: [
        {
          type: "div",
          content: htmlContent,
          attributes: { id: "wrapper" },
        },
      ],
    },
  ];
};
