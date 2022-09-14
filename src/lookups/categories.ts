const Categories = [
  {
    label: "Gastro",
    value: "1",
  },
  {
    label: "Nature",
    value: "2",
  },
  {
    label: "Adrenaline",
    value: "3",
  },
];

export const getCategoryByName = (name: string) => {
  Categories.forEach((c) => {
    if (c.label === name) return c;
  });
};

export const getCategoryById = (id: string) => {
  let category = {
    label: "",
    value: "",
  };
  Categories.forEach((c) => {
    if (c.value == id) category = c;
  });
  return category;
};

export default Categories;
