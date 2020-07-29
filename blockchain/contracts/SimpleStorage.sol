// SimpleStorage.sol
pragma solidity >=0.4.21 <0.7.0;

contract SimpleStorage {
  struct OwnerStruct{
    string id;
    string firstName;
    string lastName;
    string lats;
  }

  mapping(address => OwnerStruct) ownerList;
  mapping(string => OwnerStruct) lands;

  address[] public ownerAccts;

  function setOwner(address _address, string memory _id, string memory _fName, string memory _lName, string memory _lats) public {
      OwnerStruct memory owner;
      owner.id = _id;
      owner.firstName = _fName;
      owner.lastName = _lName;
      owner.lats = _lats;
      ownerList[_address] = owner;
      lands[_id] = owner;
      ownerAccts.push(_address);
  }
  
  function getfName(string memory _id) public view returns (string memory){
      return (lands[_id].firstName);
  }

  function getlName(string memory _id) public view returns (string memory){
      return (lands[_id].lastName);
  }

  function getLats(string memory _id) public view returns (string memory){
      return (lands[_id].lats);
  }
  
  function getOwner() public view returns(address[] memory) {
        return ownerAccts;
  }


}