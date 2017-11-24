<?php

namespace AppBundle\Service;

use Doctrine\ORM\EntityManager;


class ConfigService
{
	/**
	 * @var EntityManager
	 */
    private $em;

    const CONFIG_ID = 1;

    public function __construct(EntityManager $entityManager)
    {
        $this->em = $entityManager;
    }

    public function getConfig()
    {
        $result = $this->em->getRepository('AppBundle\Entity\Config')>find(self::CONFIG_ID);
        return $result;
    }
}