// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Election {
    event addEvent(address indexed accountAddress, uint256 studentId);

    struct semesterDetail {
        string semester;
        string course1;
        uint256 grade1;
        string course2;
        uint256 grade2;
        string course3;
        uint256 grade3;
    }

    uint256 public spacificId;
    uint256 public totalgpa;
    uint256 public totalcredit;
    uint256 public count;

    mapping(uint256 => uint256[]) public idwise;

    mapping(uint256 => semesterDetail) public studnetDetails;

    function addSemesterDetail(
        uint256 studentId,
        string memory s,
        string memory c1,
        uint256 g1,
        string memory c2,
        uint256 g2,
        string memory c3,
        uint256 g3
    ) public {
        count++;
        studnetDetails[count] = semesterDetail(s, c1, g1, c2, g2, c3, g3);
        idwise[studentId].push(count);
        emit addEvent(msg.sender, studentId);
    }

    function get(uint256 id) public view returns (uint256[] memory) {
        return idwise[id];
    }

    function result(uint256 id) public {
        spacificId = id;
        totalcredit = idwise[id].length * 9;

        uint256 value = 0;

        for (uint256 i = 0; i < idwise[id].length; i++) {
            value +=
                studnetDetails[idwise[id][i]].grade1 +
                studnetDetails[idwise[id][i]].grade2 +
                studnetDetails[idwise[id][i]].grade3;
        }
        totalgpa = value;
    }
}
