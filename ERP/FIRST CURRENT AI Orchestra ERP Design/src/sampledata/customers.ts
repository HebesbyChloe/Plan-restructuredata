export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  emotion: "positive" | "curious" | "neutral" | "happy" | "hesitant";
  badge: "New" | "VIP" | "Regular";
  rank: "new" | "first" | "repeat" | "loyal" | "vip" | "vvip";
  priority: "urgent" | "high" | "normal";
  contactMethods: Array<"email" | "phone" | "instagram">;
  status: string;
  statusColor: string;
  stage: string;
  stageColor: string;
  nextAction: string;
  summary: string;
  dateCreated: string;
  createdBy: string;
  lastUpdated: string;
  updatedBy: string;
}

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Nguyen Anh",
    emotion: "curious",
    badge: "New",
    rank: "new",
    priority: "high",
    contactMethods: ["email", "phone", "instagram"],
    status: "Need Follow Up",
    statusColor: "amber",
    stage: "Price Consider",
    stageColor: "amber",
    nextAction: "Call within 24h",
    summary: "Khách Nguyen Anh hỏi về vòng phong thuỷ cho người mệnh Kim, sinh năm 1990. Được tư vấn 2 mẫu: Citrine + Pyrite charm Tài Lộc ($145) và Tiger Eye + Hematite charm Bình An ($125). Khách quan tâm đến mẫu Citrine nhưng cần xem thêm về tác dụng và so sánh giá với shop khác. Hẹn liên hệ lại trong 2-3 ngày.",
    dateCreated: "Sep 28",
    createdBy: "Sarah Nguyen",
    lastUpdated: "Sep 30",
    updatedBy: "Sarah Nguyen",
  },
  {
    id: "2",
    name: "Le Hoa",
    emotion: "positive",
    badge: "New",
    rank: "first",
    priority: "high",
    contactMethods: ["phone", "email", "instagram"],
    status: "High Potential",
    statusColor: "blue",
    stage: "Interest",
    stageColor: "blue",
    nextAction: "Send product catalog",
    summary: "Khách Le Hoa lần đầu inbox qua Zalo, hỏi về nhẫn nữ đá hồng thạch anh cho tuổi Thìn 1988. Khách rất hào hứng khi được giới thiệu collection mới Rose Quartz + Moonstone, đặc biệt thích thiết kế dáng oval. Giá $199 khách thấy hợp lý, đang chờ gửi catalog chi tiết để khách xem thêm mẫu khác.",
    dateCreated: "Sep 29",
    createdBy: "Michael Tran",
    lastUpdated: "Sep 29",
    updatedBy: "Michael Tran",
  },
  {
    id: "3",
    name: "Tran Nam",
    emotion: "hesitant",
    badge: "Regular",
    rank: "repeat",
    priority: "urgent",
    contactMethods: ["phone", "email", "instagram"],
    status: "Multiple Follow Up",
    statusColor: "red",
    stage: "Hesitation",
    stageColor: "orange",
    nextAction: "Escalate to manager",
    summary: "Khách Tran Nam quan tâm vòng tay Black Obsidian + Hematite cho nam giới, order ID 51083. Đã follow up 3 lần về giá $155, khách vẫn thấy cao so với budget $120. Đã đề xuất combo 2 vòng giảm 15% nhưng khách chỉ cần 1 chiếc. Cần escalate lên manager để xem có thể flexible về giá không.",
    dateCreated: "Sep 25",
    createdBy: "Sarah Nguyen",
    lastUpdated: "Sep 28",
    updatedBy: "David Chen",
  },
  {
    id: "4",
    name: "Vu Long",
    emotion: "happy",
    badge: "VIP",
    rank: "vip",
    priority: "normal",
    contactMethods: ["email", "phone", "instagram"],
    status: "Closed Won",
    statusColor: "green",
    stage: "Purchase",
    stageColor: "green",
    nextAction: "Thank you message",
    summary: "Khách Vu Long đã hoàn tất order ID 51089 vòng Jade + Gold Charm Phát Tài trị giá $150. Khách rất hài lòng với chất lượng và packaging, đã confirm nhận hàng. Thanh toán nhanh chóng qua transfer. Cần gửi thank you message và giới thiệu referral program cho khách.",
    dateCreated: "Sep 29",
    createdBy: "Michael Tran",
    lastUpdated: "Sep 30",
    updatedBy: "Jessica Lee",
  },
  {
    id: "5",
    name: "Xuan Xuan",
    emotion: "neutral",
    badge: "New",
    rank: "loyal",
    priority: "high",
    contactMethods: ["email", "phone", "instagram"],
    status: "Need Follow Up",
    statusColor: "amber",
    stage: "Purchase",
    stageColor: "green",
    nextAction: "Follow up for bracelet size",
    summary: "Khách Xuân Xuân chủ động hỏi về deal vòng tay nam, order ID 51081. Khách muốn mua vòng để tặng bạn nam sinh năm 1996 mệnh Thuỷ, mong hỗ trợ sức khoẻ và công việc vì bạn đang khó khăn về việc làm và sức khoẻ. Được tư vấn 3 mẫu, khách chọn vòng Black Tourmaline + Kyanite charm Lu Thống, hỗ trợ cả tài lộc và sức khoẻ; giá gốc $169, sale còn $118 (giảm 30%). Khách chưa biết size tay bạn nên hẹn gửi size sau. Khách đã đặt hàng và xác nhận thanh toán, sẽ gửi size tay sau. Sale cần follow up nhận size để hoàn tất đơn.",
    dateCreated: "Oct 1",
    createdBy: "Sarah Nguyen",
    lastUpdated: "Oct 1",
    updatedBy: "Sarah Nguyen",
  },
];
