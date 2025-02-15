<?php include_once './inc/header.php'; ?>
  <!--********************************************menu-list***************************************************-->
  <div class="menu-list text-center">
    <p id="user-name" style="font-size:x-large; text-align: right; font-weight: bold; margin: 5px;">جاري التحميل...</p>
    <br/>
    <button class="btn" id="btnpretest">  الاختبار القبلي</button>
      <button class="btn" id="topic1" onclick="openpages(0)"> العمل التطوعى</button>
      <button class="btn" id="topic2" onclick="openpages(1)">قراءة متحررة العمل التطوعي </button>
      <button class="btn" onclick="openpages(2)">وصية إلى ولدي </button>
      <button class="btn" onclick="openpages(3)">قراءة متحررة  وصية إلى ولدي</button>
      <button class="btn" onclick="openpages(4)">حرية الذين يعلمون </button>
      <button class="btn" onclick="openpages(5)">قراءة متحررة حرية الذين يعلمون </button>
      <button class="btn" id="btnposttest">  الاختبار البعدي</button>
      <button class="btn btn-primary" id="btnchatroom">غرفة الدردشة</button>
      <button class="btn btn-danger" onclick="logout()">خروج</button>
    </div>
  <!--********************************************buttons***************************************************-->
  <div class="chatai"></div>
  <div class="user"></div>
  <div class="admin" id="admin-button"></div>