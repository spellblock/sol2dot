import { sol2dot } from ".";

const exampleContract = `
pragma solidity ^0.8.0;

contract MyContract {
  uint256 public foo;

  function setFoo(uint256 _foo) internal {
    foo = _foo;
  }

  function getFoo() public view returns (uint256) {
    return foo;
  }

  function resetFoo() public {
    setFoo(0);
  }

}
`;

console.log("Creating dot graph...");
const dot = sol2dot(exampleContract);
console.log("Done!");
console.log(dot);

export default {};
