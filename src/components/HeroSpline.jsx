import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <div className="w-full h-full">
      <Spline
        scene="https://prod.spline.design/Tddl75W6Ij9Qp77j/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
