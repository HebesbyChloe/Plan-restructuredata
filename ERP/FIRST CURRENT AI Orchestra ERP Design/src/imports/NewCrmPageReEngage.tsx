import svgPaths from "./svg-ujup985glp";

function Heading1() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[36px] left-0 text-[#101828] text-[30px] text-nowrap top-[-3px] whitespace-pre">Re-Engage Board</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[24px] left-0 text-[#6a7282] text-[16px] text-nowrap top-[-1.67px] whitespace-pre">Manage and track customer reactivation batches</p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[68px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <Paragraph />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p25397b80} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p18e6a68} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2241fff0} id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p2c4f400} id="Vector_4" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-blue-50 relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[80.813px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[80.813px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#6a7282] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Total Batches</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 top-0 w-[481.333px]" data-name="Container">
      <Container1 />
      <Text />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-[52px] top-[48px] w-[429.333px]" data-name="Paragraph">
      <p className="basis-0 font-['Arimo:Bold',_sans-serif] font-bold grow leading-[32px] min-h-px min-w-px relative shrink-0 text-[#101828] text-[24px]">5</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[481.333px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[481.333px]">
        <Container2 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_22_2694)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #7F22FE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p240d7000} id="Vector_2" stroke="var(--stroke-0, #7F22FE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25499600} id="Vector_3" stroke="var(--stroke-0, #7F22FE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_22_2694">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-violet-50 relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon1 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[98.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[98.938px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#6a7282] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Total Customers</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 top-[16.67px] w-[481.333px]" data-name="Container">
      <Container4 />
      <Text1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-start left-[52px] top-[64.67px] w-[429.333px]" data-name="Paragraph">
      <p className="basis-0 font-['Arimo:Bold',_sans-serif] font-bold grow leading-[32px] min-h-px min-w-px relative shrink-0 text-[#101828] text-[24px]">1,750</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[481.333px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.667px_0px_0px] border-gray-100 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[481.333px]">
        <Container5 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[1.526e_-5px] h-[220.667px] items-start relative shrink-0 w-full" data-name="Container">
      <Container3 />
      <Container6 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[262px] items-start left-0 pb-[0.667px] pt-[20.667px] px-[20.667px] rounded-[14px] top-0 w-[522.667px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.667px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Container7 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3ac0b600} id="Vector" stroke="var(--stroke-0, #2F80ED)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3c797180} id="Vector_2" stroke="var(--stroke-0, #2F80ED)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-blue-50 relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon2 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[117.792px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[117.792px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#6a7282] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Response Rate Avg</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 top-0 w-[481.333px]" data-name="Container">
      <Container9 />
      <Text2 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[32px] left-[52px] top-[48px] w-[429.333px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[32px] left-0 text-[#2f80ed] text-[24px] top-[-2px] w-[47px]">25%</p>
    </div>
  );
}

function Container11() {
  return <div className="bg-[#2f80ed] h-[8px] rounded-[2.23696e+07px] shrink-0 w-full" data-name="Container" />;
}

function Container12() {
  return (
    <div className="absolute bg-gray-100 box-border content-stretch flex flex-col h-[8px] items-start left-[52px] overflow-clip pl-0 pr-[322px] py-0 rounded-[2.23696e+07px] top-[88px] w-[429.333px]" data-name="Container">
      <Container11 />
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[96px] relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Paragraph3 />
      <Container12 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_22_2690)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #F2C94C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3e012060} id="Vector_2" stroke="var(--stroke-0, #F2C94C)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_22_2690">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-amber-50 relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon3 />
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[128.094px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[128.094px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#6a7282] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Conversion Rate Avg</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[40px] items-center left-0 top-[12.67px] w-[481.333px]" data-name="Container">
      <Container14 />
      <Text3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[32px] left-[52px] top-[60.67px] w-[429.333px]" data-name="Paragraph">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[32px] left-0 text-[#f2c94c] text-[24px] top-[-2px] w-[44px]">15%</p>
    </div>
  );
}

function Container16() {
  return <div className="bg-[#f2c94c] h-[8px] rounded-[2.23696e+07px] shrink-0 w-full" data-name="Container" />;
}

function Container17() {
  return (
    <div className="absolute bg-gray-100 box-border content-stretch flex flex-col h-[8px] items-start left-[52px] overflow-clip pl-0 pr-[364.938px] py-0 rounded-[2.23696e+07px] top-[100.67px] w-[429.333px]" data-name="Container">
      <Container16 />
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[108.667px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.667px_0px_0px] border-gray-100 border-solid inset-0 pointer-events-none" />
      <Container15 />
      <Paragraph4 />
      <Container17 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[220.667px] items-start relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <Container18 />
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[262px] items-start left-[538.67px] pb-[0.667px] pt-[20.667px] px-[20.667px] rounded-[14px] top-0 w-[522.667px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.667px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Container19 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d="M12 2V22" id="Vector" stroke="var(--stroke-0, #27AE60)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p2ba0dca0} id="Vector_2" stroke="var(--stroke-0, #27AE60)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-emerald-50 relative rounded-[10px] shrink-0 size-[48px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[48px]">
        <Icon4 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[160.729px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[160.729px]">
        <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[80px] text-[#6a7282] text-[14px] text-center text-nowrap top-[-1.33px] translate-x-[-50%] whitespace-pre">Total Reactivated Revenue</p>
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[36px] relative shrink-0 w-[114.083px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[114.083px]">
        <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[36px] left-[57.5px] text-[#101828] text-[30px] text-center top-[-3px] translate-x-[-50%] w-[115px]">$107,810</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[220.667px] items-center justify-center relative shrink-0 w-full" data-name="Container">
      <Container21 />
      <Text4 />
      <Paragraph5 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[262px] items-start left-[1077.33px] pb-[0.667px] pt-[20.667px] px-[20.667px] rounded-[14px] top-0 w-[522.667px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0.667px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
      <Container22 />
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[262px] relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Container20 />
      <Container23 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#101828] h-[36px] left-0 rounded-[10px] top-0 w-[69.656px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[16px] text-[14px] text-white top-[6.67px] w-[38px]">All (5)</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-gray-100 h-[36px] left-[77.66px] rounded-[10px] top-0 w-[79.563px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[16px] text-[#4a5565] text-[14px] top-[6.67px] w-[48px]">New (1)</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-gray-100 h-[36px] left-[165.22px] rounded-[10px] top-0 w-[123.646px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[16px] text-[#4a5565] text-[14px] top-[6.67px] w-[92px]">In Progress (2)</p>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-gray-100 h-[36px] left-[296.87px] rounded-[10px] top-0 w-[110.542px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[16px] text-[#4a5565] text-[14px] top-[6.67px] w-[79px]">Assigned (0)</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-gray-100 h-[36px] left-[415.41px] rounded-[10px] top-0 w-[86.948px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[16px] text-[#4a5565] text-[14px] top-[6.67px] w-[55px]">Done (2)</p>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute box-border content-stretch flex flex-col h-[68.667px] items-start left-[0.67px] pb-[0.667px] pt-[16px] px-[24px] top-[0.67px] w-[1598.67px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.667px] border-gray-200 border-solid inset-0 pointer-events-none" />
      <Container25 />
    </div>
  );
}

function HeaderCell() {
  return (
    <div className="absolute h-[52.333px] left-0 top-0 w-[346.531px]" data-name="Header Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[14.67px] whitespace-pre">Batch Name</p>
    </div>
  );
}

function HeaderCell1() {
  return (
    <div className="absolute h-[52.333px] left-[346.53px] top-0 w-[200.292px]" data-name="Header Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[14.67px] whitespace-pre">Assigned Rep</p>
    </div>
  );
}

function HeaderCell2() {
  return (
    <div className="absolute h-[52.333px] left-[546.82px] top-0 w-[149.25px]" data-name="Header Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[14.67px] whitespace-pre">Batch Size</p>
    </div>
  );
}

function HeaderCell3() {
  return (
    <div className="absolute h-[52.333px] left-[696.07px] top-0 w-[193.823px]" data-name="Header Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[14.67px] whitespace-pre">Historical Value</p>
    </div>
  );
}

function HeaderCell4() {
  return (
    <div className="absolute h-[52.333px] left-[889.9px] top-0 w-[191.844px]" data-name="Header Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[14.67px] whitespace-pre">Status</p>
    </div>
  );
}

function HeaderCell5() {
  return (
    <div className="absolute h-[52.333px] left-[1081.74px] top-0 w-[164.344px]" data-name="Header Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[14.67px] whitespace-pre">Response %</p>
    </div>
  );
}

function HeaderCell6() {
  return (
    <div className="absolute h-[52.333px] left-[1246.08px] top-0 w-[178.802px]" data-name="Header Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[14.67px] whitespace-pre">Conversion %</p>
    </div>
  );
}

function HeaderCell7() {
  return (
    <div className="absolute h-[52.333px] left-[1424.88px] top-0 w-[173.781px]" data-name="Header Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[14.67px] whitespace-pre">Created Date</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute bg-gray-50 h-[52.333px] left-0 top-0 w-[1598.67px]" data-name="Table Row">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.667px] border-gray-200 border-solid inset-0 pointer-events-none" />
      <HeaderCell />
      <HeaderCell1 />
      <HeaderCell2 />
      <HeaderCell3 />
      <HeaderCell4 />
      <HeaderCell5 />
      <HeaderCell6 />
      <HeaderCell7 />
    </div>
  );
}

function TableHeader() {
  return (
    <div className="absolute h-[52.333px] left-0 top-0 w-[1598.67px]" data-name="Table Header">
      <TableRow />
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[19px] w-[298.531px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#101828] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Q4 2024 High-Value Inactive</p>
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[56.667px] left-0 top-0 w-[346.531px]" data-name="Table Cell">
      <Button5 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[90.97px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[18.33px] w-[102.969px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Sarah Nguyen</p>
      <Icon5 />
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[56.667px] left-[346.53px] top-0 w-[200.292px]" data-name="Table Cell">
      <Button6 />
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[56.667px] left-[546.82px] top-0 w-[149.25px]" data-name="Table Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[17px] whitespace-pre">450</p>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[55.656px]" data-name="Text">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[20px] left-0 text-[#27ae60] text-[14px] top-[-2px] w-[56px]">$125,000</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[56.667px] left-[696.07px] top-0 w-[193.823px]" data-name="Table Cell">
      <Text5 />
    </div>
  );
}

function StatusBadge() {
  return (
    <div className="bg-amber-50 h-[20px] relative rounded-[8px] shrink-0 w-[80.604px]" data-name="StatusBadge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[10px] py-[2px] relative w-[80.604px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#bb4d00] text-[12px] text-nowrap whitespace-pre">In Progress</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[24px] top-[18.33px] w-[96.604px]" data-name="Button">
      <StatusBadge />
      <Icon6 />
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[56.667px] left-[889.9px] top-0 w-[191.844px]" data-name="Table Cell">
      <Button7 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[27.323px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#2f80ed] text-[14px] top-[-2px] w-[28px]">32%</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[56.667px] left-[1081.74px] top-0 w-[164.344px]" data-name="Table Cell">
      <Text6 />
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[25.177px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#f2c94c] text-[14px] top-[-2px] w-[26px]">18%</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[56.667px] left-[1246.08px] top-0 w-[178.802px]" data-name="Table Cell">
      <Text7 />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[56.667px] left-[1424.88px] top-0 w-[173.781px]" data-name="Table Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#4a5565] text-[14px] text-nowrap top-[17px] whitespace-pre">Sep 15, 2024</p>
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute h-[56.667px] left-0 top-0 w-[1598.67px]" data-name="Table Row">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.667px] border-gray-200 border-solid inset-0 pointer-events-none" />
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
      <TableCell7 />
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[19px] w-[298.531px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#101828] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Summer 2024 Lapsed Customers</p>
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[56.667px] left-0 top-0 w-[346.531px]" data-name="Table Cell">
      <Button8 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[82.06px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[18.33px] w-[94.063px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Michael Tran</p>
      <Icon7 />
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[56.667px] left-[346.53px] top-0 w-[200.292px]" data-name="Table Cell">
      <Button9 />
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[56.667px] left-[546.82px] top-0 w-[149.25px]" data-name="Table Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[17px] whitespace-pre">320</p>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[50.063px]" data-name="Text">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[20px] left-0 text-[#27ae60] text-[14px] top-[-2px] w-[51px]">$89,000</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[56.667px] left-[696.07px] top-0 w-[193.823px]" data-name="Table Cell">
      <Text8 />
    </div>
  );
}

function StatusBadge1() {
  return (
    <div className="basis-0 bg-emerald-50 grow h-[20px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="StatusBadge">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[10px] py-[2px] relative w-full">
          <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#007a55] text-[12px] text-nowrap whitespace-pre">Done</p>
        </div>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[24px] top-[18.33px] w-[65.156px]" data-name="Button">
      <StatusBadge1 />
      <Icon8 />
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[56.667px] left-[889.9px] top-0 w-[191.844px]" data-name="Table Cell">
      <Button10 />
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[27.323px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#2f80ed] text-[14px] top-[-2px] w-[28px]">28%</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[56.667px] left-[1081.74px] top-0 w-[164.344px]" data-name="Table Cell">
      <Text9 />
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[25.177px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#f2c94c] text-[14px] top-[-2px] w-[26px]">15%</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[56.667px] left-[1246.08px] top-0 w-[178.802px]" data-name="Table Cell">
      <Text10 />
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[56.667px] left-[1424.88px] top-0 w-[173.781px]" data-name="Table Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#4a5565] text-[14px] text-nowrap top-[17px] whitespace-pre">Aug 1, 2024</p>
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute h-[56.667px] left-0 top-[56.67px] w-[1598.67px]" data-name="Table Row">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.667px] border-gray-200 border-solid inset-0 pointer-events-none" />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
      <TableCell15 />
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[19px] w-[298.531px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#101828] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">VIP Dormant Accounts</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[56.667px] left-0 top-0 w-[346.531px]" data-name="Table Cell">
      <Button11 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute left-[70.25px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[18.33px] w-[82.25px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Jessica Lee</p>
      <Icon9 />
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[56.667px] left-[346.53px] top-0 w-[200.292px]" data-name="Table Cell">
      <Button12 />
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[56.667px] left-[546.82px] top-0 w-[149.25px]" data-name="Table Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[17px] whitespace-pre">125</p>
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[55.656px]" data-name="Text">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[20px] left-0 text-[#27ae60] text-[14px] top-[-2px] w-[56px]">$215,000</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[56.667px] left-[696.07px] top-0 w-[193.823px]" data-name="Table Cell">
      <Text11 />
    </div>
  );
}

function StatusBadge2() {
  return (
    <div className="bg-amber-50 h-[20px] relative rounded-[8px] shrink-0 w-[80.604px]" data-name="StatusBadge">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[10px] py-[2px] relative w-[80.604px]">
        <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#bb4d00] text-[12px] text-nowrap whitespace-pre">In Progress</p>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[24px] top-[18.33px] w-[96.604px]" data-name="Button">
      <StatusBadge2 />
      <Icon10 />
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[56.667px] left-[889.9px] top-0 w-[191.844px]" data-name="Table Cell">
      <Button13 />
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[27.615px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#2f80ed] text-[14px] top-[-2px] w-[28px]">45%</p>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[56.667px] left-[1081.74px] top-0 w-[164.344px]" data-name="Table Cell">
      <Text12 />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[27.323px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#f2c94c] text-[14px] top-[-2px] w-[28px]">28%</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[56.667px] left-[1246.08px] top-0 w-[178.802px]" data-name="Table Cell">
      <Text13 />
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[56.667px] left-[1424.88px] top-0 w-[173.781px]" data-name="Table Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#4a5565] text-[14px] text-nowrap top-[17px] whitespace-pre">Sep 20, 2024</p>
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute h-[56.667px] left-0 top-[113.33px] w-[1598.67px]" data-name="Table Row">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.667px] border-gray-200 border-solid inset-0 pointer-events-none" />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
      <TableCell21 />
      <TableCell22 />
      <TableCell23 />
    </div>
  );
}

function Button14() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[19px] w-[298.531px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#101828] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Q3 2024 90-Day Inactive</p>
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[56.667px] left-0 top-0 w-[346.531px]" data-name="Table Cell">
      <Button14 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="absolute left-[74.96px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button15() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[18.33px] w-[86.958px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">David Chen</p>
      <Icon11 />
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[56.667px] left-[346.53px] top-0 w-[200.292px]" data-name="Table Cell">
      <Button15 />
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[56.667px] left-[546.82px] top-0 w-[149.25px]" data-name="Table Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[17px] whitespace-pre">580</p>
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[50.063px]" data-name="Text">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[20px] left-0 text-[#27ae60] text-[14px] top-[-2px] w-[51px]">$98,000</p>
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[56.667px] left-[696.07px] top-0 w-[193.823px]" data-name="Table Cell">
      <Text14 />
    </div>
  );
}

function StatusBadge3() {
  return (
    <div className="basis-0 bg-emerald-50 grow h-[20px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="StatusBadge">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[10px] py-[2px] relative w-full">
          <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#007a55] text-[12px] text-nowrap whitespace-pre">Done</p>
        </div>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button16() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[24px] top-[18.33px] w-[65.156px]" data-name="Button">
      <StatusBadge3 />
      <Icon12 />
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[56.667px] left-[889.9px] top-0 w-[191.844px]" data-name="Table Cell">
      <Button16 />
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[27.323px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#2f80ed] text-[14px] top-[-2px] w-[28px]">22%</p>
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[56.667px] left-[1081.74px] top-0 w-[164.344px]" data-name="Table Cell">
      <Text15 />
    </div>
  );
}

function Text16() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[25.177px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#f2c94c] text-[14px] top-[-2px] w-[26px]">12%</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[56.667px] left-[1246.08px] top-0 w-[178.802px]" data-name="Table Cell">
      <Text16 />
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[56.667px] left-[1424.88px] top-0 w-[173.781px]" data-name="Table Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#4a5565] text-[14px] text-nowrap top-[17px] whitespace-pre">Jul 10, 2024</p>
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute h-[56.667px] left-0 top-[170px] w-[1598.67px]" data-name="Table Row">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.667px] border-gray-200 border-solid inset-0 pointer-events-none" />
      <TableCell24 />
      <TableCell25 />
      <TableCell26 />
      <TableCell27 />
      <TableCell28 />
      <TableCell29 />
      <TableCell30 />
      <TableCell31 />
    </div>
  );
}

function Button17() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[19px] w-[298.531px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#101828] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">New Product Launch Reactivation</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[56.333px] left-0 top-0 w-[346.531px]" data-name="Table Cell">
      <Button17 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="absolute left-[90.97px] size-[12px] top-[4px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #4A5565)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button18() {
  return (
    <div className="absolute h-[20px] left-[24px] top-[18.33px] w-[102.969px]" data-name="Button">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] text-nowrap top-[-1.33px] whitespace-pre">Sarah Nguyen</p>
      <Icon13 />
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[56.333px] left-[346.53px] top-0 w-[200.292px]" data-name="Table Cell">
      <Button18 />
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[56.333px] left-[546.82px] top-0 w-[149.25px]" data-name="Table Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#101828] text-[14px] text-nowrap top-[17px] whitespace-pre">275</p>
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[49.802px]" data-name="Text">
      <p className="absolute font-['Arimo:Bold',_sans-serif] font-bold leading-[20px] left-0 text-[#27ae60] text-[14px] top-[-2px] w-[50px]">$67,500</p>
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[56.333px] left-[696.07px] top-0 w-[193.823px]" data-name="Table Cell">
      <Text17 />
    </div>
  );
}

function StatusBadge4() {
  return (
    <div className="basis-0 bg-gray-100 grow h-[20px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="StatusBadge">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[20px] items-center px-[10px] py-[2px] relative w-full">
          <p className="font-['Arimo:Regular',_sans-serif] font-normal leading-[16px] relative shrink-0 text-[#4a5565] text-[12px] text-nowrap whitespace-pre">New</p>
        </div>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button19() {
  return (
    <div className="absolute content-stretch flex gap-[4px] h-[20px] items-center left-[24px] top-[18.33px] w-[60.656px]" data-name="Button">
      <StatusBadge4 />
      <Icon14 />
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[56.333px] left-[889.9px] top-0 w-[191.844px]" data-name="Table Cell">
      <Button19 />
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[19.552px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#2f80ed] text-[14px] top-[-2px] w-[20px]">0%</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[56.333px] left-[1081.74px] top-0 w-[164.344px]" data-name="Table Cell">
      <Text18 />
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute h-[18.667px] left-[24px] top-[19.67px] w-[19.552px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-0 text-[#f2c94c] text-[14px] top-[-2px] w-[20px]">0%</p>
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[56.333px] left-[1246.08px] top-0 w-[178.802px]" data-name="Table Cell">
      <Text19 />
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[56.333px] left-[1424.88px] top-0 w-[173.781px]" data-name="Table Cell">
      <p className="absolute font-['Arimo:Regular',_sans-serif] font-normal leading-[20px] left-[24px] text-[#4a5565] text-[14px] text-nowrap top-[17px] whitespace-pre">Oct 1, 2024</p>
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute h-[56.333px] left-0 top-[226.67px] w-[1598.67px]" data-name="Table Row">
      <TableCell32 />
      <TableCell33 />
      <TableCell34 />
      <TableCell35 />
      <TableCell36 />
      <TableCell37 />
      <TableCell38 />
      <TableCell39 />
    </div>
  );
}

function TableBody() {
  return (
    <div className="absolute h-[283px] left-0 top-[52.33px] w-[1598.67px]" data-name="Table Body">
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
      <TableRow5 />
    </div>
  );
}

function Table() {
  return (
    <div className="absolute h-[335.333px] left-[0.67px] overflow-clip top-[69.33px] w-[1598.67px]" data-name="Table">
      <TableHeader />
      <TableBody />
    </div>
  );
}

function Container27() {
  return (
    <div className="bg-white h-[405.333px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div className="h-[405.333px] overflow-clip relative rounded-[inherit] w-full">
        <Container26 />
        <Table />
      </div>
      <div aria-hidden="true" className="absolute border-[0.667px] border-gray-200 border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]" />
    </div>
  );
}

export default function NewCrmPageReEngage() {
  return (
    <div className="bg-[#f8f9fb] relative size-full" data-name="New CRM Page re-engage">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] items-start pb-0 pt-[32px] px-[181.667px] relative size-full">
          <Container />
          <Container24 />
          <Container27 />
        </div>
      </div>
    </div>
  );
}