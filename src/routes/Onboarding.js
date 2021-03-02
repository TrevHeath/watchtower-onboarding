import React, { useState } from "react";

import {
  Button,
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Label,
  Select,
} from "theme-ui";

import { CustomCheckboxTree as CheckboxTree } from "../components/checkboxTree/checkboxTree";
import Layout from "../components/Layout";

const mapToOptionTree = (options) => {
  return options.map((i, k) => ({
    label: i.category,
    value: `${i.category} - ${k}`,
    children:
      i.subCategories &&
      i.subCategories.map((sub, kSub) => {
        return {
          label: sub,
          value: `${i.category} / ${sub} - ${kSub}`,
          children:
            i.subSubCategories &&
            i.subSubCategories.map((subSub, kSubSub) => {
              return {
                label: subSub,
                value: `${i.category} / ${sub} / ${subSub} - ${kSub + kSubSub}`,
              };
            }),
        };
      }),
  }));
};

function normalizeString(str) {
  return str.trim();
  // .toLowerCase()
  // .split(" ")
  // .map(function (word) {
  //   return word[0].toUpperCase() + word.substr(1);
  // })
  // .join(" ")
}

const options = [
  {
    category: "Rescues",
    subCategories: ["Rip Current", "Surf"],
    subSubCategories: ["Swimmer", "Apparatus", "Other"],
  },
  {
    category: "Preventative Action",
    subCategories: ["Rip Current", "Surf"],
    subSubCategories: ["Swimmer", "Apparatus", "Other"],
  },
  {
    category: "Minor Medical Aid",
    subCategories: [
      "Laceration",
      "Abrasion",
      "Fracture",
      "Sprain or Strain",
      "Head Neck Back Injury",
      "Stingray",
      "JellyFish",
      "Other",
    ],
    subSubCategories: ["Skating", "Surfing", "Biking", "Other"],
  },
  {
    category: "Major Medical Aid",
    subCategories: [
      "Laceration",
      "Abrasion",
      "Fracture",
      "Sprain or Strain",
      "Head Neck Back Injury",
      "Stingray",
      "JellyFish",
      "Other",
    ],
    subSubCategories: ["Skating", "Surfing", "Biking", "Other"],
  },
  {
    category: "Enforcement",
    subCategories: ["Warning", "Citation", "PD Assist", "Arrest"],
    subSubCategories: [
      "BBQ",
      "Alcohol",
      "Fighting",
      "Smoking",
      "Unsafe Beach Activity",
      "Other",
    ],
  },
  {
    category: "Missing Person",
    subCategories: ["Child", "Adult"],
    subSubCategories: ["Lost", "Found"],
  },
  {
    category: "Contact",
    subCategories: [
      "Public Assist",
      "Public Education",
      "Providing Information",
    ],
  },
  {
    category: "Wildlife",
    subCategories: ["Bird", "Mammal", "Shark"],
    subSubCategories: ["Live", "Dead", "Injured"],
  },
  {
    category: "Boat",
    subCategories: ["Warning", "Tow", "Assist", "Rescue"],
  },
  {
    category: "Attendance",
    subCategories: ["Beach", "Surfers", "Bodyboarders", "Lagoon"],
  },
];

function Onboarding() {
  const [values, setValues] = useState(options);
  const [inputValues, setInputValues] = useState({ categorySelect: "All" });

  const onInputChange = (e) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value && e.target.value,
    });
  };

  const onClear = () => {
    setValues([]);
  };

  const onAdd = (value, name) => {
    try {
      const normalizedValue = normalizeString(value);
      setValues((prevVals) => {
        let newVals;
        if (name === "category") {
          newVals = [
            ...prevVals,
            {
              [name]: normalizedValue,
            },
          ];
        } else {
          prevVals.forEach((c, i) => {
            if (inputValues.categorySelect === "All") {
              if (!prevVals[i][name]) {
                prevVals[i][name] = [normalizedValue];
              } else {
                prevVals[i][name].push(normalizedValue);
              }
            } else {
              if (inputValues.categorySelect === c.category) {
                if (!prevVals[i][name]) {
                  prevVals[i][name] = [normalizedValue];
                } else {
                  prevVals[i][name].push(normalizedValue);
                }
              }
            }
          });

          newVals = prevVals;
        }

        return newVals;
      });
      setInputValues({
        ...inputValues,
        [name]: "",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const mappedOptions = mapToOptionTree(values);

  return (
    <Layout withNav={false} bannerChildren="Watchtower Onboarding">
      <Box
        m={2}
        p={5}
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          bg: "blue",
          color: "white",
        }}
      >
        Please fill out the below form to get your Watchtower configured to your
        beach. If you have questions, please reach out to your Watchtower rep.
      </Box>
      <Flex
        py={4}
        sx={{ flexWrap: "wrap", maxWidth: "1200px", margin: "auto" }}
      >
        <Box
          sx={{ width: ["100%", "50%"], borderBottom: "1px solid lightgray" }}
          p={3}
        >
          <Heading pb={1}>Select Your Stat Categories</Heading>
          <Text sx={{ fontSize: 13 }} pb={3}>
            Check the categories you would like to capture
          </Text>
          <CheckboxTree options={mappedOptions} handleClear={onClear} />
        </Box>
        <Flex p={3} sx={{ width: ["100%", "50%"], flexDirection: "column" }}>
          <Heading pb={1}>Custom Categories</Heading>
          <Text fontSize={13} pb={3}>
            Custom categories will show in your checkbox tree
          </Text>
          <Flex py={3} sx={{ flexDirection: "column" }}>
            <Box pb={2}>
              <Label>Add Custom Category</Label>
              <Input
                value={inputValues.category || ""}
                name="category"
                onChange={onInputChange}
              />
              <Box py={2}>
                <Button onClick={() => onAdd(inputValues.category, "category")}>
                  Add
                </Button>
              </Box>
            </Box>
          </Flex>
          <Flex py={3} sx={{ flexDirection: "column" }}>
            <Heading as="h4" pb={1}>
              Custom SubCategories
            </Heading>
            <Text fontSize={13} pb={3}>
              Select the category you would like your sub and sub sub categories
              to be added to.
            </Text>
            <Box py={2}>
              <Label>Add to:</Label>
              <Select
                value={(inputValues && inputValues.categorySelect) || "All"}
                name="categorySelect"
                onChange={onInputChange}
                defaultValue="All"
              >
                <option value={"All"}>{"All"}</option>
                {values.map((v, i) => {
                  return (
                    <option key={i} value={v.category}>
                      {v.category}
                    </option>
                  );
                })}
              </Select>
            </Box>
            <Box py={3}>
              <Label>SubCategory</Label>
              <Input
                value={inputValues.subCategories || ""}
                name="subCategories"
                onChange={onInputChange}
              />
              <Box py={2}>
                <Button
                  onClick={() =>
                    onAdd(inputValues.subCategories, "subCategories")
                  }
                >
                  Add
                </Button>
              </Box>
            </Box>

            <Box pb={2}>
              <Label>SubSubCategory</Label>
              <Input
                value={inputValues.subSubCategories || ""}
                name="subSubCategories"
                onChange={onInputChange}
              />
            </Box>

            <Box>
              <Button
                onClick={() =>
                  onAdd(inputValues.subSubCategories, "subSubCategories")
                }
              >
                Add
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
}

export default Onboarding;
