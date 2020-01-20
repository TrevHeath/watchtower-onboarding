import React, { useState } from "react";

export default function App() {
  const [values, setValues] = useState({});

  function handleChange(e, field) {
    let cleanValue;
    if (e.target.name === "agency") {
      const removeFront = e.target.value.split(
        "has submitted their stat form:, ```"
      );
      cleanValue = removeFront[1]
        ? {
            name: removeFront[0],
            stats: removeFront[1].split(",").map(i => ({ label: i.trim() }))
          }
        : "";
    }
    if (e.target.name === "positions") {
      const removeFront = e.target.value.split(",");

      cleanValue = removeFront
        ? removeFront.map(i => ({
            name: i && i.trim(),
            dispatchable: false
          }))
        : "";
    }

    if (e.target.name === "users") {
      const removeFront = e.target.value.split(",");

      cleanValue = removeFront
        ? removeFront.map(i => ({
            name: i && i.trim()
          }))
        : "";
    }

    setValues({ ...values, [e.target.name]: cleanValue || e.target.value });
  }
  function handleSubmit() {
    console.log(values);
  }

  return (
    <div className="App">
      <textarea
        name="agency"
        rows="25"
        style={{
          width: "100%"
        }}
        onChange={e => handleChange(e)}
      />

      {values.agency ? (
        <div>
          {values.agency.stats ? (
            <div>
              <h3>Agency:</h3>
              {values.agency.name}
              <h3>Stats:</h3>
              {JSON.stringify(values.agency.stats).replace(
                /\"([^(\")"]+)\":/g,
                "$1:"
              )}
            </div>
          ) : (
            "Invalid input"
          )}
        </div>
      ) : (
        "Paste agency snippet"
      )}

      <textarea
        name="users"
        rows="25"
        style={{ width: "100%" }}
        onChange={handleChange}
      />

      {values.users ? (
        <div>
          <h3>Users:</h3>
          {JSON.stringify(values.users).replace(/\"([^(\")"]+)\":/g, "$1:")}
          <h4>Dispatchable?</h4>
          {values.users.map(p => (
            <div>
              <input
                checked={values[p.name]}
                name={p.name}
                type="checkbox"
                onChange={handleChange}
              />
              <label for={p.name}>{p.name}</label>
            </div>
          ))}
        </div>
      ) : (
        "Paste users snippet"
      )}

      <textarea
        name="positions"
        rows="25"
        style={{ width: "100%" }}
        onChange={handleChange}
      />

      {values.positions ? (
        <div>
          <h3>Positions:</h3>
          {JSON.stringify(values.positions).replace(/\"([^(\")"]+)\":/g, "$1:")}
          <h4>Dispatchable?</h4>
          {values.positions.map(p => (
            <div>
              <input
                checked={values[p.name]}
                name={p.name}
                type="checkbox"
                onChange={handleChange}
              />
              <label for={p.name}>{p.name}</label>
            </div>
          ))}
        </div>
      ) : (
        "Paste postions snippet"
      )}

      <button onClick={handleSubmit}>Submit</button>

      {/* {stats.split(",").map(i => (
        <div>{i}</div>
      ))} */}
    </div>
  );
}
const stats =
  "Seal Beach Marine Safety has submitted their stat form:, ``` Rescues,Rescues / Rip Current,Rescues / Rip Current / Swimmer,Rescues / Rip Current / Apparatus,Rescues / Rip Current / Other,Rescues / Surf,Rescues / Surf / Swimmer,Rescues / Surf / Apparatus,Rescues / Surf / Other,Rescues / Pier,Rescues / Pier / Swimmer,Rescues / Pier / Apparatus,Rescues / Pier / Other,Rescues / Rocks & Jetty,Rescues / Rocks & Jetty / Swimmer,Rescues / Rocks & Jetty / Apparatus,Rescues / Rocks & Jetty / Other,Rescues / Other,Rescues / Other / Swimmer,Rescues / Other / Apparatus,Rescues / Other / Other,Preventative Action,Preventative Action / Rip Current,Preventative Action / Rip Current / Swimmer,Preventative Action / Rip Current / Apparatus,Preventative Action / Rip Current / Other,Preventative Action / Surf,Preventative Action / Surf / Swimmer,Preventative Action / Surf / Apparatus,Preventative Action / Surf / Other,Preventative Action / Pier,Preventative Action / Pier / Swimmer,Preventative Action / Pier / Apparatus,Preventative Action / Pier / Other,Preventative Action / Rocks & Jetty,Preventative Action / Rocks & Jetty / Swimmer,Preventative Action / Rocks & Jetty / Apparatus,Preventative Action / Rocks & Jetty / Other,Preventative Action / Other,Preventative Action / Other / Swimmer,Preventative Action / Other / Apparatus,Preventative Action / Other / Other,Minor Medical Aid,Minor Medical Aid / Laceration,Minor Medical Aid / Laceration / Skating,Minor Medical Aid / Laceration / Surfing,Minor Medical Aid / Laceration / Biking,Minor Medical Aid / Laceration / Other,Minor Medical Aid / Abrasion,Minor Medical Aid / Abrasion / Skating,Minor Medical Aid / Abrasion / Surfing,Minor Medical Aid / Abrasion / Biking,Minor Medical Aid / Abrasion / Other,Minor Medical Aid / Fracture,Minor Medical Aid / Fracture / Skating,Minor Medical Aid / Fracture / Surfing,Minor Medical Aid / Fracture / Biking,Minor Medical Aid / Fracture / Other,Minor Medical Aid / Sprain or Strain,Minor Medical Aid / Sprain or Strain / Skating,Minor Medical Aid / Sprain or Strain / Surfing,Minor Medical Aid / Sprain or Strain / Biking,Minor Medical Aid / Sprain or Strain / Other,Minor Medical Aid / Head Neck Back Injury,Minor Medical Aid / Head Neck Back Injury / Skating,Minor Medical Aid / Head Neck Back Injury / Surfing,Minor Medical Aid / Head Neck Back Injury / Biking,Minor Medical Aid / Head Neck Back Injury / Other,Minor Medical Aid / Stingray,Minor Medical Aid / Stingray / Skating,Minor Medical Aid / Stingray / Surfing,Minor Medical Aid / Stingray / Biking,Minor Medical Aid / Stingray / Other,Minor Medical Aid / JellyFish,Minor Medical Aid / JellyFish / Skating,Minor Medical Aid / JellyFish / Surfing,Minor Medical Aid / JellyFish / Biking,Minor Medical Aid / JellyFish / Other,Minor Medical Aid / Other,Minor Medical Aid / Other / Skating,Minor Medical Aid / Other / Surfing,Minor Medical Aid / Other / Biking,Minor Medical Aid / Other / Other,Major Medical Aid,Major Medical Aid / Laceration,Major Medical Aid / Laceration / Skating,Major Medical Aid / Laceration / Surfing,Major Medical Aid / Laceration / Biking,Major Medical Aid / Laceration / Other,Major Medical Aid / Abrasion,Major Medical Aid / Abrasion / Skating,Major Medical Aid / Abrasion / Surfing,Major Medical Aid / Abrasion / Biking,Major Medical Aid / Abrasion / Other,Major Medical Aid / Fracture,Major Medical Aid / Fracture / Skating,Major Medical Aid / Fracture / Surfing,Major Medical Aid / Fracture / Biking,Major Medical Aid / Fracture / Other,Major Medical Aid / Sprain or Strain,Major Medical Aid / Sprain or Strain / Skating,Major Medical Aid / Sprain or Strain / Surfing,Major Medical Aid / Sprain or Strain / Biking,Major Medical Aid / Sprain or Strain / Other,Major Medical Aid / Head Neck Back Injury,Major Medical Aid / Head Neck Back Injury / Skating,Major Medical Aid / Head Neck Back Injury / Surfing,Major Medical Aid / Head Neck Back Injury / Biking,Major Medical Aid / Head Neck,Back Injury / Other,Major Medical Aid / Stingray,Major Medical Aid / Stingray / Skating,Major Medical Aid / Stingray / Surfing,Major Medical Aid / Stingray / Biking,Major Medical Aid / Stingray / Other,Major Medical Aid / JellyFish,Major Medical Aid / JellyFish / Skating,Major Medical Aid / JellyFish / Surfing,Major Medical Aid / JellyFish / Biking,Major Medical Aid / JellyFish / Other,Major Medical Aid / Other,Major Medical Aid / Other / Skating,Major Medical Aid / Other / Surfing,Major Medical Aid / Other / Biking,Major Medical Aid / Other / Other,Enforcement,Enforcement / Warning,Enforcement / Warning / BBQ,Enforcement / Warning / Alcohol,Enforcement / Warning / Fighting,Enforcement / Warning / Smoking,Enforcement / Warning / Unsafe Beach Activity,Enforcement / Warning / Other,Enforcement / Citation,Enforcement / Citation / BBQ,Enforcement / Citation / Alcohol,Enforcement / Citation / Fighting,Enforcement / Citation / Smoking,Enforcement / Citation / Unsafe Beach Activity,Enforcement / Citation / Other,Enforcement / PD Assist,Enforcement / PD Assist / BBQ,Enforcement / PD Assist / Alcohol,Enforcement / PD Assist / Fighting,Enforcement / PD Assist / Smoking,Enforcement / PD Assist / Unsafe Beach Activity,Enforcement / PD Assist / Other,Enforcement / Arrest,Enforcement / Arrest / BBQ,Enforcement / Arrest / Alcohol,Enforcement / Arrest / Fighting,Enforcement / Arrest / Smoking,Enforcement / Arrest / Unsafe Beach Activity,Enforcement / Arrest / Other,Missing Person,Missing Person / Child,Missing Person / Child / Lost,Missing Person / Child / Found,Missing Person / Adult,Missing Person / Adult / Lost,Missing Person / Adult / Found,Contact,Contact / Public Assist,Contact / Public Education,Contact / Providing Information,Wildlife,Wildlife / Bird,Wildlife / Bird / Live,Wildlife / Bird / Dead,Wildlife / Bird / Injured,Wildlife / Mammal,Wildlife / Mammal / Live,Wildlife / Mammal / Dead,Wildlife / Mammal / Injured,Wildlife / Shark,Wildlife / Shark / Live,Wildlife / Shark / Dead,Wildlife / Shark / Injured,Boat,Boat / Warning,Boat / Tow,Boat / Assist,Boat / Rescue,Attendance,Attendance / Beach,Attendance / Surfers,Attendance / Bodyboarders,Enforcement / Dogs,Enforcement / Dogs / Other,Enforcement / Dogs / Service Animal,Boat / Warning / Kite-board,Boat / Tow / Kite-board,Boat / Assist / Kite-board,Boat / Rescue / Kite-board,Boat / Warning / Other,Boat / Tow / Other,Boat / Assist / Other,Boat / Rescue / Other";
