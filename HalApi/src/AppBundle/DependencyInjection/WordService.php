<?php

namespace AppBundle\DependencyInjection;


use AppBundle\Entity\Word;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\EntityManager;
use Symfony\Component\DependencyInjection\Container;

class WordService
{
	/**
	 * @var EntityManager
	 */
	private $em;

	public function __construct(EntityManager $entityManager, Container $container)
	{
		$this->em = $entityManager;
		$this->container = $container;
	}

	/**
	 * @param string $word
	 * @return Word
	 */
	public function findOrCreate(string $word): Word
	{
		$word = $this->prepareWord($word);

		$result = $this->em->getRepository(Word::class)->findBy(['value' => strlower($word->getValue())],1);
		if(!$result){
			$this->em->persist($word);
			$this->em->flush();
		}else{
			$word = $result;
		}

		return $word;
	}

	public function prepareWord(string $word): Word
	{
		$word = new Word();
		$word->setValue(strlower($word));
		$word->setType();
		$word->setCreatedAt(new \DateTime());
		$word->setUpdatedAt(new \DateTime());
		return $word;
	}

	private function getWordType($word){
		return null;
	}

}