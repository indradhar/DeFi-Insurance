App={
  web3provider:null,
  contracts:{},
  account:'0x0',
  init:function()
  {
    console.log("init");
    return App.initweb3();
  },
  initweb3: function()
  {
    if(typeof web3!=='undefined')
    {
      console.log("initweb3:Metamask");

      App.web3provider=web3.currentProvider;
      web3=new Web3(App.web3provider);
    }
    else
    {
      console.log("initweb3:Ganache");

      App.web3provider=new Web3.providers.HttpProvider('http://localhost:7545');
      web3=new Web3(App.web3provider);
    }
    return App.initContract();
  },
  initContract: function()
  {
    $.getJSON("Insurance.json",function(insurance)
    {
      App.contracts.Insurance=TruffleContract(insurance);
      App.contracts.Insurance.setProvider(App.web3provider);
      console.log("initContract");
      return App.render();
    });
  },
  render: function()
  {
    var t_size;
    var addr_leader;
    web3.eth.getCoinbase(function(err,account){
      if(err==null)
      {
        App.account=account;
        
        $(document).ready(function(){
          $("#btn1").click(function(){
            //t_size= document.getElementById($("#t_sizes")).value;
           t_size=$('#t_sizes').val();
           console.log("Value Recievd"+t_size);
           $("#tv1").val(App.account)
           submitOK = "true";
           if (isNaN(t_size) || t_size< 1 || t_size> 5) 
           {
             alert("Oops! Team Size Exceeded 4. Must be less than 5");
             submitOK = "false";
           }
           if (submitOK == "false") 
           {
             return false;
           }
         });
        });
      }
    });

    $(document).ready(function(){
      $("#btn2").click(function(){
        console.log("render btn2 clicked");
        App.contracts.Insurance.deployed().then(function(insurinstance){
          //
          ginstance=insurinstance
          console.log("instantiated");

          const promise= insurinstance.enrollTeam(t_size,App.account,{from: App.account,value:'1000000000000000000'});
          promise.then((result) => {
            console.log("Transaction SuccessFul"+result);
            return insurinstance.id();
          }).then(function(id){
            console.log("ID Returned from contract"+id);
            $("#tv2").val(id);
            return insurinstance.test_val();
            }).then(function(value){
              console.log("Ether Sent from the account"+value);
              $("#tv3").val(value+" wei");
              return insurinstance.leader_addr();
            }).then(function(leader_id){
              console.log("Leader ID Returned from contract"+leader_id);
             addr_leader=leader_id;
            });
        });
      });
    });

    $(document).ready(function(){
      $("#btn3").click(function(){
        console.log("render btn3 clicked");
        t_id=$('#tv4').val();
        console.log("Value Recievd"+t_id);
        App.contracts.Insurance.deployed().then(function(insurinstance){
          console.log("instantiated");
          const promise= insurinstance.joinTeam(t_id,App.account,{from: App.account,value:'1000000000000000000'});
          promise.then((result) => {
            console.log("Transaction SuccessFul"+result);
            return insurinstance.leader_addr();
          }).then(function(id){
            console.log("Your Leader Address"+id);
            $("#tv5").val(id);
            return insurinstance.test_val1();
          }).then(function(testval){
            console.log("Ether Sent from the account"+testval);
            $("#tv6").val(testval+" wei");
            $("#tv7").val(App.account)
          });
        });
      });
    });
  }
};

$(function(){
  $(window).load(function(){
    App.init();
  });
});

