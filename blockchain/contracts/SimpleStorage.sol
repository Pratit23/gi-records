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
    string buyingRate;
    string landSize;
    string hashValue;
    string price;
  }

  mapping(string => OwnerStruct) ownerList;
  mapping(string => OwnerStruct) lands;

  string[] public ownerAccts;

  function setOwner(string memory _address, string memory _id, string memory _fName,
  string memory _lName, string memory _lats, string memory _state, string memory _city, 
  string memory _locality, string memory _plotNo,
  string memory _buyingRate, string memory _landSize, string memory _hashValue, string memory _price) public {
      OwnerStruct memory owner;
      owner.id = _address;
      owner.firstName = _fName;
      owner.lastName = _lName;
      owner.lats = _lats;
      owner.state = _state;
      owner.city = _city;
      owner.locality = _locality;
      owner.plotNo = _plotNo;
      owner.buyingRate = _buyingRate;
      owner.landSize = _landSize;
      owner.hashValue = _hashValue;
      owner.price = _price;
      ownerList[_address] = owner;
      lands[_id] = owner;
      ownerAccts.push(_address);
  }

  function transaction(string memory _buyerID, string memory _sellerID, 
  string memory _address, string memory _fName, string memory _lName, string memory _sellerLastID) public {
      OwnerStruct memory owner;
      owner = lands[_sellerID];
      owner.id = _address;
      owner.firstName = _fName;
      owner.lastName = _lName;
      lands[_buyerID] = owner;
      lands[_sellerID] = lands[_sellerLastID];
      delete lands[_sellerLastID];
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

  function getBuyingRate(string memory _id) public view returns (string memory){
      return (lands[_id].buyingRate);
  }

  function getLandSize(string memory _id) public view returns (string memory){
      return (lands[_id].landSize);
  }

  function getHashValue(string memory _id) public view returns (string memory){
      return (lands[_id].hashValue);
  }

  function getPlotNo(string memory _id) public view returns (string memory){
      return (lands[_id].plotNo);
  }

  function getPrice(string memory _id) public view returns (string memory){
      return (lands[_id].price);
  }


}