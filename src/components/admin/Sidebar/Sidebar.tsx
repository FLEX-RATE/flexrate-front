'use client';

import { usePathname, useRouter } from 'next/navigation';

import ProfileIcon from '@/assets/icons/profile_24.svg';
import { useUserStore } from '@/stores/userStore';

import {
  SidebarWrapper,
  SidebarInner,
  ProfileBox,
  ProfileName,
  ProfileGreeting,
  SidebarHr,
  MenuSection,
  MenuSectionTitle,
  MenuItemWrapper,
  MenuItem,
  SelectedBar,
  MenuSectionWrapper,
} from './Sidebar.style';

type MenuItemType = { label: string; path: string; match: (p: string) => boolean };
type MenuSectionType = { sectionTitle: string; items: MenuItemType[] };

const menuSections: MenuSectionType[] = [
  {
    sectionTitle: '관리',
    items: [
      {
        label: '고객 관리',
        path: '/admin/customer-management',
        match: (p) => p.startsWith('/admin/customer-management'),
      },
    ],
  },
  {
    sectionTitle: '대출',
    items: [
      {
        label: '대출 신청 현황',
        path: '/admin/loan-application',
        match: (p) => p === '/admin/loan-application',
      },
    ],
  },
];

const Sidebar = () => {
  const user = useUserStore((s) => s.user);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarWrapper>
      <SidebarInner>
        <ProfileBox>
          <ProfileIcon width={28} height={28} />
          <ProfileGreeting>
            {user ? (
              <>
                <ProfileName>{user.username || '관리자'}</ProfileName> 님, 반가워요!
              </>
            ) : (
              <ProfileName style={{ opacity: 0.4 }}>로딩중…</ProfileName>
            )}
          </ProfileGreeting>
        </ProfileBox>
        <SidebarHr />
        <MenuSectionWrapper>
          {menuSections.map((section) => (
            <MenuSection key={section.sectionTitle}>
              <MenuSectionTitle>{section.sectionTitle}</MenuSectionTitle>
              {section.items.map((item) => {
                const selected = item.match(pathname);
                return (
                  <MenuItemWrapper key={item.label}>
                    {selected && <SelectedBar />}
                    <MenuItem selected={selected} onClick={() => router.push(item.path)}>
                      {item.label}
                    </MenuItem>
                  </MenuItemWrapper>
                );
              })}
            </MenuSection>
          ))}
        </MenuSectionWrapper>
      </SidebarInner>
    </SidebarWrapper>
  );
};

export default Sidebar;
