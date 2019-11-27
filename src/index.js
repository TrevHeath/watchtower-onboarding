import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { Widget } from "./CheckboxTree";
import { Button, Box, Flex, Heading, Text } from "rebass";
import { Input, Label } from "@rebass/forms";
import { ThemeProvider } from "emotion-theming";
import theme from "./theme";

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

const options = [
  {
    category: "Rescues",
    subCategories: [
      "Rip Current",
      "Surf",
      "Pier",
      "Rocks & Jetty",
      "Inshore Holes",
      "Other",
      "None"
    ],
    subSubCategories: ["Swimmer", "Apparatus", "Other", "None"]
  },
  {
    category: "Preventative Action",
    subCategories: [
      "Rip Current",
      "Surf",
      "Pier",
      "Rocks & Jetty",
      "Inshore Holes",
      "Other",
      "None"
    ],
    subSubCategories: ["Swimmer", "Apparatus", "Other", "None"]
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
      "None"
    ],
    subSubCategories: ["Skating", "Surfing", "Biking", "Other", "None"]
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
      "None"
    ],
    subSubCategories: ["Skating", "Surfing", "Biking", "Other", "None"]
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
      "None"
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
    subSubCategories: ["Live", "Dead", "Injured", "None"]
  },
  {
    category: "Boat",
    subCategories: ["Warning", "Tow", "Assist", "Rescue", "None"],
    subSubCategories: ["Bicycle", "Apparatus", "None"]
  },
  {
    category: "Attendance",
    subCategories: ["Beach", "Surfers", "Bodyboarders", "Lagoon"]
  }
];

function App() {
  const [values, setValues] = useState(options);
  const [inputValues, setInputValues] = useState({});

  const onInputChange = e => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const onAdd = (value, name) => {
    try {
      setValues(prevVals => {
        let newVals;
        if (name === "category") {
          newVals = [
            ...prevVals,
            {
              [name]: value
            }
          ];
        } else {
          prevVals.forEach((c, i) => {
            if (!prevVals[i][name]) {
              prevVals[i][name] = [value];
            } else {
              prevVals[i][name].push(value);
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
            py: 5,
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

        <Flex py={4} sx={{ maxWidth: "1200px", margin: "auto" }}>
          <Box width={[1, 1 / 2]} p={3} borderBottom="1px solid lightgray">
            <Heading pb={1}>Select your categories</Heading>
            <Text fontSize={13} pb={3}>
              Check the categories you would like to capture
            </Text>
            <Widget options={mappedOptions} />
          </Box>
          <Flex flexDirection="column" p={3} width={[1, 1 / 2]}>
            <Heading pb={1}>Add custom categories</Heading>
            <Text fontSize={13} pb={3}>
              Custom categories will show in your checkbox tree
            </Text>
            <Flex py={2} flexDirection="column">
              <Box pb={2}>
                <Label>Custom Category</Label>
                <Input
                  value={inputValues.category || ""}
                  name="category"
                  onChange={onInputChange}
                />
              </Box>
              <Box>
                <Button onClick={() => onAdd(inputValues.category, "category")}>
                  Add
                </Button>
              </Box>
            </Flex>
            <Flex py={2} flexDirection="column">
              <Box pb={2}>
                <Label>Custom SubCategory</Label>
                <Input
                  value={inputValues.subCategories || ""}
                  name="subCategories"
                  onChange={onInputChange}
                />
              </Box>
              <Box>
                <Button
                  onClick={() =>
                    onAdd(inputValues.subCategories, "subCategories")
                  }
                >
                  Add
                </Button>
              </Box>
            </Flex>
            <Flex py={2} flexDirection="column">
              <Box pb={2}>
                <Label>Custom SubSubCategory</Label>
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
