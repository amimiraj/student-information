App = {
  webProvider: null,
  contracts: {},
  account: '0x0',

  init: function () {
    return App.initWeb();
  },
  initWeb: function () {

    const provider = window.ethereum
    if (provider) {
      App.webProvider = provider;
    }
    else {
      $("#loader-msg").html('No metamask ethereum provider found')
      App.webProvider = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Election.json", function (election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.webProvider);
      App.listenForEvents();
      return App.render();
    })
  },
  render: async function () {
    let instances;

    let Id;
    let totalgpa;
    let totalcredit;
    let  x;

    if (window.ethereum) {
      try {

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        App.account = accounts;
        $("#accountAddress").html("Your Account: " + App.account);
      } catch (error) {
        if (error.code === 4001) {
          console.warn('user rejected')
        }
        $("#accountAddress").html("Your Account: Not Connected");
        console.error(error);
      }
    }
    //load contract ddata
   App.contracts.Election.deployed().then(async function (instance) {
        instances = instance;

          id=await instance.spacificId();
          totalgpa=await instance.totalgpa();
          totalcredit=await instance.totalcredit();
          x=await instances.get(parseInt(id));
   
          return id;
      
    }).then(async function (value) {

      //------------------------------------------------------

      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();
      var bottomLine = $("#bottomLine");
      bottomLine.empty();

      var totalCredit = value.length * 9;

      for (let i of x) {
        instances.studnetDetails(parseInt(i)).then((info) => {
          if (info) {
            var s = info[0];
            var c1 = info[1];
            var g1 = info[2];
            var c2 = info[3];
            var g2 = info[4];
            var c3 = info[5];
            var g3 = info[6];

            var candidateTemplate = "<tr> <th>" + s + "</th> <td></td> </tr>"
              + "<tr> <td>" + c1 + "</td> <td>" + g1 + "</td> </tr>"
              + "<tr> <td>" + c2 + "</td> <td>" + g2 + "</td> </tr>"
              + "<tr> <td>" + c3 + "</td> <td>" + g3 + "</td> </tr>";
            candidatesResults.append(candidateTemplate);
          }
        });     
      }


  
       var cgpa=parseInt(totalgpa)/parseInt(totalcredit);
       var result=cgpa.toFixed(2);


      var cgpavalue = "<td>Total Credit : " + totalcredit + " </td> <td> CGPA : " + result + "</td>";
      bottomLine.append(cgpavalue);

      //-------------------------------------------------------
    })

  },
  addCourseGrade: function () {

    let sId = $("#studentId").val();

    let s = $("#semester").val();

    let c1 = $("#course1").val();
    let g1 = $("#cGrade1").val();

    let c2 = $("#course2").val();
    let g2 = $("#cGrade2").val();

    let c3 = $("#course3").val();
    let g3 = $("#cGrade3").val();


    App.contracts.Election.deployed().then(function (instance) {

      return instance.addSemesterDetail(sId, s, c1, g1, c2, g2, c3, g3, { from: App.account[0] })

    }).then(function (result) {
      console.log({ result })
    }).catch(function (err) { console.error(err) })

  },

  viewDetails: function () {

    let sId = $("#studentId").val();


    App.contracts.Election.deployed().then(function (instance) {

      return instance.result(sId, { from: App.account[0] })

    }).then(function (result) {
      console.log({ result })
    }).catch(function (err) { console.error(err) })

 
  },

  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {
      instance.addEvent({}, {

      }).watch(function (err, event) {
        console.log("Triggered", event);
        App.render()
      })
    })
  },

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});