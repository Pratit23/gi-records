// SimpleStorage.sol
pragma solidity >=0.4.21 <0.7.1;

contract SimpleStorage {
  struct OwnerStruct{
    string id;
    string firstName;
    string lastName;
    string lats;
    string state;
    string city;
    string locality;
    string plotNo;
    string price;
  }

  mapping(address => OwnerStruct) ownerList;
  mapping(string => OwnerStruct) lands;

  address[] public ownerAccts;

  function setOwner(address _address, string memory _id, string memory _fName, string memory _lName, string memory _lats, string memory _state, string memory _city, string memory _locality, string memory _plotNo, string memory _price) public {
      OwnerStruct memory owner;
      owner.id = _id;
      owner.firstName = _fName;
      owner.lastName = _lName;
      owner.lats = _lats;
      owner.state = _state;
      owner.state = _city;
      owner.state = _locality;
      owner.state = _plotNo;
      owner.state = _price;
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

  function getState(string memory _id) public view returns (string memory){
      return (lands[_id].state);
  }

  function getCity(string memory _id) public view returns (string memory){
      return (lands[_id].city);
  }

  function getLocality(string memory _id) public view returns (string memory){
      return (lands[_id].locality);
  }

  function getPlotNo(string memory _id) public view returns (string memory){
      return (lands[_id].plotNo);
  }

  function getPrice(string memory _id) public view returns (string memory){
      return (lands[_id].price);
  }
  
  function getOwner() public view returns(address[] memory) {
        return ownerAccts;
  }


}