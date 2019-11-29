import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { Widget } from "./CheckboxTree";
import { Button, Box, Flex, Heading, Text } from "rebass";
import { Input, Label, Select } from "@rebass/forms";
import { ThemeProvider } from "emotion-theming";
import theme from "./theme";

require("dotenv").config();

const mapToOptionTree = options => {
  return options.map((i, k) => ({
    label: i.category,
    value: `${i.category} - ${k}`,
    children:
      i.subCategories &&
      i.subCategories.map((sub, kSub) => {
        return {
          label: sub,
          value: `${i.category} / ${sub} - ${Math.random()}`,
          children:
            i.subSubCategories &&
            i.subSubCategories.map((subSub, kSubSub) => {
              return {
                label: subSub,
                value: `${i.category} / ${sub} / ${subSub} - ${Math.random()}`
              };
            })
        };
      })
  }));
};

function normalizeString(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function(word) {
      return word[0].toUpperCase() + word.substr(1);
    })
    .join(" ")
    .trim();
}

const options = [
  {
    category: "Rescues",
    subCategories: [
      "Rip Current",
      "Surf",
      "Pier",
      "Rocks & Jetty",
      "Inshore Holes",
      "Other"
    ],
    subSubCategories: ["Swimmer", "Apparatus", "Other"]
  },
  {
    category: "Preventative Action",
    subCategories: [
      "Rip Current",
      "Surf",
      "Pier",
      "Rocks & Jetty",
      "Inshore Holes",
      "Other"
    ],
    subSubCategories: ["Swimmer", "Apparatus", "Other"]
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
      "Other"
    ],
    subSubCategories: ["Skating", "Surfing", "Biking", "Other"]
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
      "Other"
    ],
    subSubCategories: ["Skating", "Surfing", "Biking", "Other"]
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
      "Other"
    ]
  },
  {
    category: "Missing Person",
    subCategories: ["Child", "Adult"],
    subSubCategories: ["Lost", "Found"]
  },
  {
    category: "Contact",
    subCategories: [
      "Public Assist",
      "Public Education",
      "Providing Information"
    ]
  },
  {
    category: "Wildlife",
    subCategories: ["Bird", "Mammal", "Shark"],
    subSubCategories: ["Live", "Dead", "Injured"]
  },
  {
    category: "Boat",
    subCategories: ["Warning", "Tow", "Assist", "Rescue"],
    subSubCategories: ["Bicycle", "Apparatus"]
  },
  {
    category: "Attendance",
    subCategories: ["Beach", "Surfers", "Bodyboarders", "Lagoon"]
  }
];

function App() {
  const [values, setValues] = useState(options);
  const [inputValues, setInputValues] = useState({ categorySelect: "All" });

  const onInputChange = e => {
    console.log(values);
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const onAdd = (value, name) => {
    try {
      const normalizedValue = normalizeString(value);
      setValues(prevVals => {
        let newVals;
        if (name === "category") {
          newVals = [
            ...prevVals,
            {
              [name]: normalizedValue
            }
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
        [name]: ""
      });
    } catch (e) {
      console.error(e);
    }
  };

  const mappedOptions = mapToOptionTree(values);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            px: 4,
            py: "10rem",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1444762908691-c8461d64d5f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3300&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 8,
            color: "white",
            bg: "gray",
            position: "relative"
          }}
        >
          <Heading
            sx={{ position: "relative", zIndex: "2" }}
            textAlign="center"
            fontSize={[5, 6]}
            as="h4"
          >
            Watchtower Stat Application
          </Heading>
          <Box
            sx={{
              position: "absolute",
              top: "0px",
              right: "0px",
              left: "0px",
              bottom: "0px",
              zIndex: "1",
              backgroundColor: "rgb(51, 51, 51)",
              opacity: "0.8"
            }}
          />
        </Box>
        <Box m={2} p={5} textAlign="center" bg={"lightgray"}>
          Please fill out the below form to get your Watchtower configured to
          your beach. If you have questions, please reach out to your Watchtower
          rep.
        </Box>
        <Flex
          flexWrap="wrap"
          py={4}
          sx={{ maxWidth: "1200px", margin: "auto" }}
        >
          <Box width={[1, 1 / 2]} p={3} borderBottom="1px solid lightgray">
            <Heading pb={1}>Select Your Stat Categories</Heading>
            <Text fontSize={13} pb={3}>
              Check the categories you would like to capture
            </Text>
            <Widget options={mappedOptions} />
          </Box>
          <Flex flexDirection="column" p={3} width={[1, 1 / 2]}>
            <Heading pb={1}>Custom Categories</Heading>
            <Text fontSize={13} pb={3}>
              Custom categories will show in your checkbox tree
            </Text>
            <Flex py={3} flexDirection="column">
              <Box pb={2}>
                <Label>Add Custom Category</Label>
                <Input
                  value={inputValues.category || ""}
                  name="category"
                  onChange={onInputChange}
                />
                <Box py={2}>
                  <Button
                    onClick={() => onAdd(inputValues.category, "category")}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Flex>
            <Flex py={3} flexDirection="column">
              <Heading as="h4" pb={1}>
                Custom SubCategories
              </Heading>
              <Text fontSize={13} pb={3}>
                Select the category you would like your sub and sub sub
                categories to be added to.
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
      </ThemeProvider>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
