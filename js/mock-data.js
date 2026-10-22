export const demoData = Object.freeze({
  brand: "QuickWheels",
  user: { name: "Aditi", phone: "+91 98••• ••410" },
  route: {
    from: "Surat Railway Station — Main Gate",
    fromShort: "Surat Station",
    to: "City Light, Surat",
    arrival: "18:14",
    train: "Train 12926 · on time",
    distance: "7.8 km"
  },
  rides: [
    { id:"shared", icon:"↗", name:"Shared cab", label:"Best value", pickup:"6 min", duration:"28 min", detail:"2 seats · max +5 min detour", price:"₹140", saving:"Save ₹180" },
    { id:"private", icon:"●", name:"Private cab", label:"Direct", pickup:"4 min", duration:"23 min", detail:"Private sedan", price:"₹320", saving:"" },
    { id:"auto", icon:"◒", name:"Auto rickshaw", label:"Street pickup", pickup:"8 min", duration:"30 min", detail:"Metered-style fixed quote", price:"₹190", saving:"Save ₹130" }
  ],
  booking: { reference:"QW-SUR-2419", fare:"₹140", saving:"₹180", pickup:"6 min", seats:"2 seats", detour:"+5 min max", pin:["4","8","1","9"] },
  driver: { name:"Rajesh P.", initials:"RP", rating:"4.85", trips:"2,400+ trips", vehicle:"White Maruti Dzire", plate:"GJ 05 XX 1234", verification:"Identity & background verified" },
  traveller: { name:"Ananya S.", initials:"AS", descriptor:"Verified professional · same drop-off corridor" },
  pickup: {
    zone:"Zone A · Bay 2", detail:"Near Main Gate, Exit 3", driverEta:"2 min",
    steps:["Take Exit Gate 3 beside Platform 1","Walk straight for 40 metres","Turn right at the prepaid taxi booth","Look for the yellow A2 pillar and the white Dzire"]
  },
  trip: { eta:"6:42 PM", status:"On schedule", detour:"2 of 5 min used", destination:"City Light" },
  receipt: { base:"₹100", distance:"₹220", discount:"− ₹180", total:"₹140", payment:"UPI AutoPay", carbon:"35%" },
  errors: {
    match: { title:"No shared match was found in time", owner:"Nearby driver supply is lower than expected.", evidence:"Your ₹140 quote and destination are still saved under QW-SUR-2419.", action:"Switch to a private cab for ₹270 with a ₹50 match-failure credit.", time:"A private driver can arrive in about 5 minutes." },
    driver: { title:"Rajesh cancelled near the station", owner:"Congestion prevented the driver from entering Zone A.", evidence:"Your original ₹140 fare and boarding request remain confirmed.", action:"We can assign Mehul S. at Bay 3 automatically.", time:"Reassignment takes about 90 seconds." }
  }
});
