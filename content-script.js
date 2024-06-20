/*Injecting PopUP*/
var extension = document.querySelector('.vspemailer');
if (extension != null) {
  extension.remove();
  //document.getElementById('close-btn').remove();
} else {
  init();
}
document.getElementById('icon').addEventListener('click', close);

function close(){
  document.querySelector('.vspemailer').remove();
}
function init() {
  const injectElement = document.createElement('div');
  injectElement.className = 'vspemailer';
  injectElement.innerHTML = '<div id="fl-close"><span title="Close" id="icon">&#10006; </span></div><div id="popup-content"><div id="extension-container"><div id="logo-title"><div class="title-container neon-glow-mail"><h1>Approval For<span><br>VSP Script</span> &#9993;</h1></div></div><div class="button-1" id="required-info"><p>Please attach a file, then click on the buttons below for the templates.</p><div id="input-parent-container-1"><button id="Review-button">Approval Not Needed</button></div><div class="button-1" id="required-info-buttons"><div id="input-parent-container-2"><button id="Review-buttons">Approval Needed</button></div></div><div class="button-1" id="required-info-buttonss"><div id="input-parent-container-3"><button id="Review-buttonss">Video Fulfillment Complete</button></div></div></div></div></div>'
  document.body.appendChild(injectElement);


  
  var inputValue = document.getElementById("form:emailSubject").value; // Regular expression to match the number after "Sub ID:"
  var regex = /Sub ID:\s*(\d+)/; // Match the number using the regular expressionvar 
  match = inputValue.match(regex); // Extract the number if there's a match
  if (match) {     var subIdNumber = match[1]; // The number captured by the first group in the regex    
  console.log("Sub ID number:", subIdNumber); 
} else {    
   console.log("Sub ID number not found.");
   }
 
 
  
  const getApiUrl = `https://fulfillmentservices.int.thomsonreuters.com/fulfillment-services/subscription-services/9.3/subscriptionWldIdMappings/${subIdNumber}`;
  const postApiUrl = 'https://fulfillmentservices.int.thomsonreuters.com/fulfillment-services/customer-services/10.0/customerBannerDetails';
  const getApiKey = '2Ry1BspQkW51SqyOOyJbnMCRRdfBGNiJ';
  const postApiKey = 'Z5ntOBoGXCOOTw7I6sW8fiDAMLRamhQu';
  
  // Function to fetch data from API
  async function fetchData(url, apiKey) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-TR-FL-API-APP-ID': apiKey
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const xmlData = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, 'text/xml');
      const wldId = xmlDoc.querySelector('wldId').textContent;
  
      // Execute POST request
      const postResponse = await fetch(postApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml;charset=utf-8',
          'X-TR-FL-API-APP-ID': postApiKey
        },
        body: `
          <nk:request>
            <nk:param type="XML" name="WLDID">
              <![CDATA[
                <WLDID>
                  <wldId>${wldId}</wldId>
                  <profileId>1</profileId>
                </WLDID>
              ]]>
            </nk:param>
          </nk:request>
        `
      });
  
      if (!postResponse.ok) {
        throw new Error('Post request failed');
      }
  
      return await postResponse.text();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  }
  
  // Execute fetchData function
  fetchData(getApiUrl, getApiKey)
    .then(responseText => {
      // Parse the XML response
      console.log("Data is fetched");
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(responseText, 'text/xml');
  
      // Extract the value of the seoConsultant field
      const seoConsultantElement = xmlDoc.querySelector('seoConsultant');
      const seoConsultant = seoConsultantElement ? seoConsultantElement.textContent : '';
      localStorage.setItem('seoConsultantName', seoConsultant);
      console.log(seoConsultant);
      
      const seoConsultantmail = xmlDoc.querySelectorAll('seoConsultantEmails string');
  
      let emailcontent;
  
      if (seoConsultantmail.length === 0) {
        emailcontent = '[Content Strategist Email]';
      } else {
        let matchFound = false;
        // Split the consultant's name into parts
        const nameParts = seoConsultant.split(' ');
  
        // Iterate over seoConsultantmail and check for partial match with any part of consultant's name
        for (let i = 0; i < seoConsultantmail.length; i++) {
          const email = seoConsultantmail[i].textContent;
          
          if (nameParts.some(part => email.toLowerCase().includes(part.toLowerCase()))) {
            emailcontent = typeof email !== 'undefined' ? email : '[Content Strategist Email]';
            matchFound = true;
            break; // Exit loop after printing the first match
          }
        }
  
        if (!matchFound) {
          console.log("No matching email found for consultant:", seoConsultant);
        }
        
      }
       localStorage.setItem('emailContent', emailcontent);
      // clientname = localStorage.getItem("emailContent");
      // console.log(emailcontent + "emailContent...");
         
  
      console.log("emailContent", emailcontent);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
  // Function to handle button click event
function handleButtonClick() {
  // Call the reviewbtn function with the seoConsultant value
  reviewbtn(localStorage.getItem('seoConsultantName'));
}

// Add event listener to the button
document.getElementById('Review-button').addEventListener('click', handleButtonClick);





   




/*Extracting Firm Name*/
var locclientname = localStorage.getItem("clientname");

var subjectline = document.getElementById('form:emailSubject').value;

    
    
    
// var clientname = subjectline.substring(0, subjectline.indexOf("–") - 1);

if (locclientname != null) {
  console.log();
  var rec = subjectline.substring(0, subjectline.indexOf("–") - 1);
  if (rec != locclientname && rec != '') {
    localStorage.setItem("clientname", rec);
    console.log('rec' + rec);
  } else if (rec == '') {
    var latestfirmname = document.getElementById('form:emailBody').value;
    latestfirmname = latestfirmname.substring(5, latestfirmname.indexOf("\n") - 1);
    localStorage.setItem("clientname", locclientname);
    if (latestfirmname != '' && locclientname != latestfirmname) {
      localStorage.setItem("clientname", latestfirmname);
    }
    console.log('rec empty' + locclientname);
  }
} else {
  var clientname = subjectline.substring(0, subjectline.indexOf("–") - 1);
  localStorage.setItem("clientname", clientname);
  console.log(clientname + 'loc empty');
}

clientname = localStorage.getItem("clientname");
console.log(clientname + "client Name...");

//Function for pulling email from DOM
// document.getElementById('form:emailFrom').value = `[CONTENT STRATEGIST EMAIL]`;
//document.getElementById('form:emailCc').value='[CONTENT STRATEGIST EMAIL]`;
var text = document.getElementsByClassName("rich-menu-list-bg")[0].innerHTML;
var element = document.createElement("div");
element.innerHTML = text.replaceAll("onclick", "name");
var items = element.children;
var first = "";
var clienContacts = [];
var accountManagers = [];
var sales = [];
for (var i = 0; i < items.length; i++) {
  var x = items[i].getAttribute("name");
  if (x === null) continue;
  x = x.substring(x.lastIndexOf(",") + 3, x.lastIndexOf("'"));
  if (i === 0) first = x;
  if (i !== 0 && x == first) break;
  if (items[i].children.length >= 2) {
    console.log(items[i].children[1]);
    const innerText = items[i].children[1].innerText;
    if (innerText.includes("Client Contact")) clienContacts.push(x);
    if (innerText.includes("Account Manager")) accountManagers.push(x);
    //  console.log(accountManagers[0]);
    if (innerText.includes("Sales Consultant")) sales.push(x); // Corrected spelling here
    
    if(sales.length==0){
      salesconsultant='[Unable to fetch Consultants email, please add it manually]';
    }

    if(accountManagers.length==0){
      accountManagers='[Unable to fetch account managers email, please add it manually]';
    }
  }
}
document.getElementById("form:emailTo").value = clienContacts.join(", ");

const emailcontent = localStorage.getItem('emailContent') ;
document.getElementById("form:emailCc").value = `[Content Strategist], ${accountManagers}`;
// document.getElementById("form:emailCc").value =  emailcontent + ', ' + accountManagers;

// document.getElementById("form:emailCc").value = '[CONTENT STRATEGIST EMAIL], ' + accountManagers;

document.getElementById('form:emailFrom').value="findlaw-video@thomsonreuters.com";
document.getElementById('form:emailBcc').value="tlr.flcorrespondence@thomsonreuters.com";
  
  // document.getElementById('Review-button').addEventListener('click', reviewbtn);
  // document.getElementById('Review-buttons').addEventListener('click', reviewbtns);
  // document.getElementById('Review-buttonss').addEventListener('click', reviewbtnss);
  document.getElementById("Review-button").addEventListener("click", function () {
    

     document.getElementById("Review-buttons").classList.remove('active');
     document.getElementById("Review-buttonss").classList.remove('active');
    reviewbtn();
     this.classList.toggle('active');
    // Call the function with index 0 for the first element
  });
  document.getElementById("Review-buttons").addEventListener("click", function () {


     document.getElementById("Review-button").classList.remove('active');
     document.getElementById("Review-buttonss").classList.remove('active');
    reviewbtns();
     this.classList.toggle('active');
    // Call the function with index 0 for the first element
  });

  document.getElementById("Review-buttonss").addEventListener("click", function () {


    document.getElementById("Review-button").classList.remove('active');
    document.getElementById("Review-buttons").classList.remove('active');
   reviewbtnss();
    this.classList.toggle('active');
   // Call the function with index 0 for the first element
 });





  var formatSwitcher = document.getElementById("formatswitcher");
  // Check if the element exists before triggering the click event
  if (formatSwitcher) {
    // Trigger the click event
    formatSwitcher.setAttribute('onclick', formatSwitcher.href);
    (!document.querySelector('.cke_wysiwyg_frame')) && formatSwitcher.click();
  }

  function reviewbtn(){
    const emailcontent = localStorage.getItem('emailContent') ;
    document.getElementById("form:emailCc").value =  emailcontent + ', ' + accountManagers;
    const seoConsultant = localStorage.getItem('seoConsultantName') || '[Content Strategist Name]';
    var accountmanager = document.querySelector(".rich-menu-item-label").innerHTML;
    accountmanager = accountmanager.substring(0, accountmanager.indexOf("(") - 1) + ", " + accountmanager.substring(accountmanager.indexOf("(") + 1, accountmanager.lastIndexOf(")"));
    
    document.getElementById('form:emailSubject').value = `${clientname}_ScriptNumber_PA`;
    var iframe = document.querySelector('.cke_wysiwyg_frame');
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document || window.frames['iframe'].document;
    var iframeBody = iframeDoc.body;
    iframeBody.innerHTML = `<div>Hello ${clientname},</div><br>

    <div>Attached, please find the script to be used for the animated video that will be promoted on your Facebook page.</div><br>
    
    <div>Please review and send any feedback within the next two business days. If we do not hear back from you within that time frame, we will 
    proceed with creating the video. After we move forward, the video will be posted live on your Facebook page. Once the video is live, your 
    Client Manager will be available to address any questions or concerns that you may have regarding your videos.</div><br>
          
    <div>If you have any questions, please feel free to contact me.</div><br>
          
    <div>Regards,</div><br>
    
    <div>On behalf of content strategist ${seoConsultant}<br>            
    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .</div><br>
    
    <div>FindLaw Video Team</div><br>
    
    <div>Thomson Reuters</div><br>
          
    <div><a href="https://www.findlaw.com/lawyer-marketing/">LawyerMarketing.com</a><br>
    Join us on <a href="https://www.facebook.com/FindLaw/">Facebook</a> | <a href="https://www.facebook.com/FindLaw/">Twitter</a> | <a href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQHnWFqlD6PR8wAAAY6iXEXgm3BtLMAew9X0HOrVtfIpZ7p9KMaXtMGtJfN82e4PiqSYiMD9eZXqqvsqS_1eXjlCuF1pmkWfjaf1Kj7fXV-lB6DfyzvDHEc6l0Dawg8NEOSzg8c=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Ffindlaw-a-thomson-reuters-business">LinkedIn</a></div><br>
     
    <div>For billing questions related to your account, please call 1-800-328-4880 or visit our Customer Service and Product Support website 
    <a href="https://legal.thomsonreuters.com/en/support">https://legal.thomsonreuters.com/en/support</a>.</div>`;

    // document.getElementById('form:emailSubject').value = '[firname]_ScriptNumber_PA';
    // document.getElementById('form:emailBody').value="I am clicked";
    
  }
  function reviewbtns(){
    const emailcontent = localStorage.getItem('emailContent') ;
    document.getElementById("form:emailCc").value =  emailcontent + ', ' + accountManagers;
    // document.getElementById('form:emailSubject').value = 'ACTION NEEDED: FindLaw has completed a blog post for review';
    const seoConsultant = localStorage.getItem('seoConsultantName') || '[Content Strategist Name]';
    document.getElementById('form:emailSubject').value = `${clientname}_ScriptNumber_PA`;
    var iframe = document.querySelector('.cke_wysiwyg_frame');
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document || window.frames['iframe'].document;
    var iframeBody = iframeDoc.body;
    iframeBody.innerHTML = `<div>Hello ${clientname},</div><br>
      
    <div>Attached, please find the script to be used for the animated video that will be promoted on your Facebook page.</div><br>
    
    <div>Please review and send your feedback. <strong>We need your approval in order to move forward with producing this video. </strong>
    After we move forward, the video will be posted live on your Facebook page.
    Once the video is live, your Client Manager will be available to address any questions or concerns that you may have regarding your videos.</div><br>
    
    <div>If you have any questions, please feel free to contact me.</div><br>
    
    <div>Regards,</div><br>
    
    <div>On behalf of content strategist ${seoConsultant}<br>            
    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .</div><br>
    
    <div>FindLaw Video Team</div><br>
    
    <div>Thomson Reuters</div><br>
    
    <div><a href="https://www.findlaw.com/lawyer-marketing/">LawyerMarketing.com</a><br>
    Join us on <a href="https://www.facebook.com/FindLaw/">Facebook</a> | <a href="https://www.facebook.com/FindLaw/">Twitter</a> | <a href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQHnWFqlD6PR8wAAAY6iXEXgm3BtLMAew9X0HOrVtfIpZ7p9KMaXtMGtJfN82e4PiqSYiMD9eZXqqvsqS_1eXjlCuF1pmkWfjaf1Kj7fXV-lB6DfyzvDHEc6l0Dawg8NEOSzg8c=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Ffindlaw-a-thomson-reuters-business">LinkedIn</a></div><br>
     
    <div>For billing questions related to your account, please call 1-800-328-4880 or visit our Customer Service and 
    Product Support website <a href="https://legal.thomsonreuters.com/en/support">https://legal.thomsonreuters.com/en/support</a>.</div> 
    `;
   
    // document.getElementById('form:emailSubject').value = '[firname]_ScriptNumber_PA';
    // document.getElementById('form:emailBody').value="I am clicked now ";
  }
  function reviewbtnss(){
    const emailcontent = localStorage.getItem('emailContent') ;
    document.getElementById("form:emailCc").value =  emailcontent + ', ' + accountManagers;
    var am = document.querySelectorAll(".rich-menu-item-label");
  for (i = 0; i < am.length; i++) {
    var x = am[i].innerText;
    var accountmanager;
    if (x.includes("Account Manager")) {
      accountmanager = x.substring(0, x.indexOf("(") - 1) + ", " + x.substring(x.indexOf("(") + 1, x.lastIndexOf(")"));
      var accmanagername = accountmanager.split(', ')[1];
      console.log("Account Manager's Name is: "+ accmanagername);
    }
    if(!accountmanager){
      accountmanager = '<b>[Unable to fetch Account Manager, please add it manually]</b>';
      var accmanagername = '<b>[Unable to fetch Account Manager, please add it manually]</b>';
    }
  }
  //var contentstrategistemail = '[CONTENT STRATEGIST EMAIL]';
  var accountmanager = document.querySelector(".rich-menu-item-label").innerHTML;
  accountmanager = accountmanager.substring(0, accountmanager.indexOf("(") - 1) + ", " + accountmanager.substring(accountmanager.indexOf("(") + 1, accountmanager.lastIndexOf(")"));
   
    
    document.getElementById('form:emailSubject').value = `FindLaw - Video Fulfillment Complete - ${clientname}`;
    var iframe = document.querySelector('.cke_wysiwyg_frame');
    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document || window.frames['iframe'].document;
    var iframeBody = iframeDoc.body;
    iframeBody.innerHTML = `<div>Dear ${clientname},</div><br>

    <div>Congratulations! I am pleased to inform you that your video is completed and will appear on your Facebook page soon. Please find attached 
    the final video.<br>
    Now that the video is completed, your Client Manager ${accmanagername} is available to address any questions or concerns that you may have 
    regarding your FindLaw products: </div><br>
    
    <div>${accmanagername}<br>    
    FindLaw Solutions Client Manager<br>      
   ${accountManagers[0]} </div><br>
    
    <div>Thank you for partnering with FindLaw in your online marketing efforts. I appreciate your involvement in helping us successfully complete this 
    project. It was a pleasure working with you! </div><br>
     
    
    <div>Regards,<br>
    . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .</div><br>
    
    <div>FindLaw Video Team</div><br>
    
    <div>Thomson Reuters</div><br>
    
    <div><a href="https://www.findlaw.com/lawyer-marketing/">LawyerMarketing.com</a><br>
    Join us on <a href="https://www.facebook.com/FindLaw/">Facebook</a> | <a href="https://www.facebook.com/FindLaw/">Twitter</a> | <a href="https://www.linkedin.com/authwall?trk=bf&trkInfo=AQHnWFqlD6PR8wAAAY6iXEXgm3BtLMAew9X0HOrVtfIpZ7p9KMaXtMGtJfN82e4PiqSYiMD9eZXqqvsqS_1eXjlCuF1pmkWfjaf1Kj7fXV-lB6DfyzvDHEc6l0Dawg8NEOSzg8c=&original_referer=&sessionRedirect=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Ffindlaw-a-thomson-reuters-business">LinkedIn</a></div><br>
     
    <div>For billing questions related to your account, please call 1-800-328-4880 or visit our Customer Service and Product Support website 
    <a href="https://legal.thomsonreuters.com/en/support">https://legal.thomsonreuters.com/en/support</a>.</div>`;
    // document.getElementById('form:emailSubject').value = 'FindLaw - Video Fulfillment Complete - [firname]';
    // document.getElementById('form:emailBody').value="I am clicked later";
  }
 

}
/*Injecting PopUP*/

